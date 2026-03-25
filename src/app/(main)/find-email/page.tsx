'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AlertModal from '@/components/AlertModal/AlertModal'
import styles from '../auth.module.css'

export default function FindEmailPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [sent, setSent] = useState(false)
  const [verified, setVerified] = useState(false)
  const [sending, setSending] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [loading, setLoading] = useState(false)
  const [timer, setTimer] = useState(0)
  const [toast, setToast] = useState('')
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [foundEmail, setFoundEmail] = useState('')
  const [phoneTouched, setPhoneTouched] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  const formatPhone = (raw: string) => {
    if (raw.length <= 3) return raw
    if (raw.length <= 7) return `${raw.slice(0, 3)}-${raw.slice(3)}`
    return `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7)}`
  }

  const isPhoneValid = /^01[0-9]{8,9}$/.test(phone)
  const phoneError = phoneTouched && phone.length > 0 && !isPhoneValid
    ? '올바른 휴대폰 번호를 입력해 주세요.' : ''

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
      setShowModal(true)
    }
  }

  const verifyCode = async () => {
    setVerifying(true)
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
      await findEmail()
    } else {
      setError(data.error || '인증번호가 올바르지 않습니다.')
      setShowModal(true)
    }
  }

  const findEmail = async () => {
    setLoading(true)
    const res = await fetch('/api/auth/find-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_name: fullName, phone }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) {
      setError(data.error || '입력하신 정보와 일치하는 이메일을 찾을 수 없습니다.')
      setShowModal(true)
      return
    }
    setFoundEmail(data.email)
  }

  if (foundEmail) {
    return (
      <div className={styles.container}>
        <div className={styles.email_login_wrap}>
          <div className={styles.email_result}>
            <p className={styles.found_email}>
              사용자님의 이메일 아이디는<br />
              <span className={styles.success_email}>{foundEmail}</span>
              입니다.
            </p>
          </div>
          <div className={styles.success_btn_wrap}>
            <button
              onClick={() => router.push('/login')}
              className={styles.login_button_round}
              style={{ marginBottom: 0 }}
            >
              로그인하기
            </button>
            <button
              onClick={() => router.push('/find-password')}
              className={styles.password_button}
            >
              비밀번호 찾기
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {toast && (
        <div style={{
          position: 'fixed', bottom: 100, left: '50%', transform: 'translateX(-50%)',
          background: '#1f2937', color: '#fff', padding: '12px 20px',
          borderRadius: 10, fontSize: 14, fontWeight: 500, whiteSpace: 'nowrap', zIndex: 999,
        }}>{toast}</div>
      )}
      {showModal && <AlertModal message={error} onClose={() => setShowModal(false)} />}
      <div className={styles.container}>
        <div className={styles.email_login_wrap}>
          <div className={styles.logo_wrap}>
            <img src="/logo.png" alt="한평생 바로유학" className={styles.logo_img} />
          </div>
          <div className={styles.divider}>
            <span>이메일 찾기</span>
          </div>

          <div className={styles.form_group}>
            <label className={styles.label}>
              이름<span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={styles.input}
              placeholder="이름을 입력해주세요"
              disabled={sent}
            />
          </div>

          <div className={styles.form_group}>
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
                setVerified(false)
              }}
              onBlur={() => setPhoneTouched(true)}
              className={`${styles.input} ${phoneError ? styles.input_error : ''}`}
              placeholder="010-0000-0000"
              disabled={sent}
              maxLength={13}
            />
            {phoneError && <div className={styles.error_message}>{phoneError}</div>}
          </div>

          {sent && (
            <div className={styles.form_group}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label className={styles.label} style={{ marginBottom: 0 }}>
                  인증번호<span className={styles.required}>*</span>
                </label>
                <button
                  type="button"
                  onClick={sendCode}
                  disabled={sending}
                  style={{ background: 'none', border: 'none', fontSize: 13, color: '#6b7280', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
                >
                  인증번호 재전송
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                  className={styles.input}
                  placeholder="인증 번호 6자리"
                  maxLength={6}
                  style={{ paddingRight: 64 }}
                />
                {timer > 0 && (
                  <span style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', fontSize: 14, fontWeight: 600, color: '#3182F6' }}>
                    {formatTimer(timer)}
                  </span>
                )}
              </div>
              {timer === 0 && sent && (
                <div className={styles.error_message}>인증 시간이 만료되었습니다. 재전송해주세요.</div>
              )}
            </div>
          )}

          {!sent ? (
            <button
              className={styles.login_button}
              disabled={!isPhoneValid || !fullName || sending}
              onClick={sendCode}
            >
              {sending ? '발송 중...' : '인증번호 받기'}
            </button>
          ) : (
            <button
              className={styles.login_button}
              disabled={code.length !== 6 || verifying || timer === 0 || loading}
              onClick={verifyCode}
            >
              {verifying || loading ? '확인 중...' : '이메일 찾기'}
            </button>
          )}

          <div className={styles.signup_wrap}>
            <span>계정이 없으신가요?</span>
            <Link href="/signup" className={styles.signup_link}>이메일로 회원가입</Link>
          </div>
        </div>
      </div>
    </>
  )
}
