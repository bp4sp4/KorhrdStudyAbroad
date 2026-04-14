'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import styles from './kakao-phone.module.css'

// 카카오 전화번호 정규화: +821012341234 → 01012341234
function normalizeKakaoPhone(raw: string | undefined): string {
  if (!raw) return ''
  const digits = raw.replace(/[^0-9]/g, '')
  if (digits.startsWith('82')) return '0' + digits.slice(2)
  return digits
}

export default function KakaoPhonePage() {
  const router = useRouter()
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [timer, setTimer] = useState(0)
  const [toast, setToast] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [hasKakaoPhone, setHasKakaoPhone] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      const kakaoPhone = user?.user_metadata?.phone_number
      const normalized = normalizeKakaoPhone(kakaoPhone)
      if (normalized) {
        setPhone(normalized)
        setHasKakaoPhone(true)
      }
    })
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  const formatPhone = (raw: string) => {
    if (raw.length <= 3) return raw
    if (raw.length <= 7) return `${raw.slice(0, 3)}-${raw.slice(3)}`
    return `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7)}`
  }

  const isPhoneValid = /^01[0-9]{8,9}$/.test(phone)

  const startTimer = () => {
    setTimer(180)
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) { clearInterval(timerRef.current!); return 0 }
        return prev - 1
      })
    }, 1000)
  }

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0')
    const s = (sec % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  const sendCode = async () => {
    setSending(true)
    setError('')
    const res = await fetch('/api/auth/verification/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    })
    const data = await res.json()
    setSending(false)
    if (data.success) {
      setSent(true)
      setCode('')
      startTimer()
      showToast('인증번호가 발송되었어요.')
    } else {
      setError(data.error || 'SMS 발송에 실패했습니다.')
    }
  }

  const verifyCode = async () => {
    setVerifying(true)
    setError('')

    const verifyRes = await fetch('/api/auth/verification/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, code }),
    })
    const verifyData = await verifyRes.json()

    if (!verifyData.success) {
      setError(verifyData.error || '인증번호가 올바르지 않습니다.')
      setVerifying(false)
      return
    }

    // 인증 완료 → 유저 메타데이터에 phone 저장
    const completeRes = await fetch('/api/auth/kakao-complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    })
    const completeData = await completeRes.json()

    setVerifying(false)
    if (completeData.success) {
      setDone(true)
      setTimeout(() => router.push('/'), 2000)
    } else {
      setError(completeData.error || '저장에 실패했습니다.')
    }
  }

  return (
    <div className={styles.container}>
      {done && (
        <div className={styles.done_overlay}>
          <div className={styles.done_box}>
            <div className={styles.done_icon}>✓</div>
            <p className={styles.done_title}>회원가입이 완료되었습니다!</p>
            <p className={styles.done_sub}>잠시 후 메인 페이지로 이동합니다.</p>
          </div>
        </div>
      )}
      {toast && <div className={styles.toast}>{toast}</div>}

      <div className={styles.inner}>
        <h2 className={styles.title}>휴대폰 인증</h2>
        <p className={styles.desc}>
          {hasKakaoPhone
            ? '카카오에서 제공된 번호로\n인증번호를 발송해 드립니다.'
            : '휴대폰 번호를 입력하시면\n인증번호를 전송해 드립니다.'}
        </p>

        {/* 전화번호 */}
        <div className={styles.field}>
          <label className={styles.label}>
            휴대폰 번호<span className={styles.required}>*</span>
          </label>
          <input
            type="tel"
            value={formatPhone(phone)}
            onChange={hasKakaoPhone ? undefined : (e) => {
              const raw = e.target.value.replace(/[^0-9]/g, '').slice(0, 11)
              setPhone(raw)
              setSent(false)
              setCode('')
              setError('')
            }}
            readOnly={hasKakaoPhone}
            placeholder="010-0000-0000"
            className={`${styles.input} ${hasKakaoPhone ? styles.input_readonly : ''}`}
            maxLength={13}
          />
        </div>

        {/* 인증번호 */}
        {sent && (
          <div className={styles.field}>
            <div className={styles.label_row}>
              <label className={styles.label}>
                인증번호<span className={styles.required}>*</span>
              </label>
              <button
                type="button"
                className={styles.resend_btn}
                onClick={sendCode}
                disabled={sending}
              >
                인증번호 재전송
              </button>
            </div>
            <div className={styles.code_wrap}>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                placeholder="인증번호 6자리"
                className={styles.input}
                maxLength={6}
              />
              {timer > 0 && (
                <span className={styles.timer}>{formatTimer(timer)}</span>
              )}
            </div>
            {timer === 0 && sent && (
              <p className={styles.error}>인증 시간이 만료되었습니다. 재전송해주세요.</p>
            )}
          </div>
        )}

        {error && <p className={styles.error}>{error}</p>}

        {!sent ? (
          <button
            className={styles.btn}
            disabled={!isPhoneValid || sending}
            onClick={sendCode}
          >
            {sending ? '발송 중...' : '인증번호 받기'}
          </button>
        ) : (
          <button
            className={styles.btn}
            disabled={code.length !== 6 || verifying || timer === 0}
            onClick={verifyCode}
          >
            {verifying ? '확인 중...' : '확인'}
          </button>
        )}
      </div>
    </div>
  )
}
