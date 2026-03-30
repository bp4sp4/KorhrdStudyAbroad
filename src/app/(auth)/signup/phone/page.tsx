'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import styles from './phone.module.css'

export default function PhoneVerifyPage() {
  const router = useRouter()
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [sent, setSent] = useState(false)
  const [verified, setVerified] = useState(false)
  const [sending, setSending] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [timer, setTimer] = useState(0)
  const [toast, setToast] = useState('')
  const [error, setError] = useState('')
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

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

  const [phoneTouched, setPhoneTouched] = useState(false)

  const formatPhone = (raw: string) => {
    if (raw.length <= 3) return raw
    if (raw.length <= 7) return `${raw.slice(0, 3)}-${raw.slice(3)}`
    return `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7)}`
  }

  const isPhoneValid = /^01[0-9]{8,9}$/.test(phone)
  const phoneError = phoneTouched && phone.length > 0 && !isPhoneValid
    ? '올바른 휴대폰 번호를 입력해 주세요.'
    : ''

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
    const res = await fetch('/api/auth/verification/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, code }),
    })
    const data = await res.json()
    setVerifying(false)
    if (data.success) {
      setVerified(true)
      if (timerRef.current) clearInterval(timerRef.current)
      router.push(`/signup/form?phone=${encodeURIComponent(phone)}`)
    } else {
      setError(data.error || '인증번호가 올바르지 않습니다.')
    }
  }

  return (
    <div className={styles.container}>
      {toast && <div className={styles.toast}>{toast}</div>}

      <div className={styles.inner}>
        <h2 className={styles.title}>휴대폰 인증</h2>
        {!sent ? (
          <p className={styles.desc}>
            휴대폰 번호를 입력하시면<br />인증번호를 전송해 드립니다.
          </p>
        ) : (
          <p className={styles.desc}>
            등록된 휴대폰 번호로 인증번호가 전송되었습니다.<br />인증번호를 입력해 주세요.
          </p>
        )}

        {/* 휴대폰 번호 */}
        <div className={styles.field}>
          <label className={styles.label}>
            휴대폰 번호<span className={styles.required}>*</span>
          </label>
          <input
            type="tel"
            value={formatPhone(phone)}
            onChange={(e) => {
              const raw = e.target.value.replace(/[^0-9]/g, '').slice(0, 11)
              setPhone(raw)
              setSent(false)
              setCode('')
              setError('')
            }}
            onBlur={() => setPhoneTouched(true)}
            placeholder="010-0000-0000"
            className={`${styles.input} ${phoneError ? styles.input_error : ''}`}
            disabled={sent}
            maxLength={13}
          />
          {phoneError && <p className={styles.error}>{phoneError}</p>}
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
                placeholder="인증 번호 6자리"
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

        {/* 버튼 */}
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
