'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AlertModal from '@/components/AlertModal/AlertModal'
import styles from '../auth.module.css'

type Step = 'phone' | 'password'

export default function FindPasswordPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('phone')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [loading, setLoading] = useState(false)
  const [timer, setTimer] = useState(0)
  const [toast, setToast] = useState('')
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
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
      if (timerRef.current) clearInterval(timerRef.current)
      setStep('password')
    } else {
      setError(data.error || '인증번호가 올바르지 않습니다.')
      setShowModal(true)
    }
  }

  const handleResetPassword = async () => {
    if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.')
      setShowModal(true)
      return
    }
    setLoading(true)
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_name: fullName, phone, password }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) {
      setError(data.error || '비밀번호 변경에 실패했습니다.')
      setShowModal(true)
      return
    }
    showToast('성공적으로 변경되었습니다.')
    setTimeout(() => router.push('/login'), 1500)
  }

  const isPasswordValid = password.length >= 8
  const isPasswordMatch = password === passwordConfirm


  // 새 비밀번호 설정 화면
  if (step === 'password') {
    return (
      <>
        {showModal && <AlertModal message={error} onClose={() => setShowModal(false)} />}
        <div className={styles.container}>
          <div className={styles.email_login_wrap}>
            <div className={styles.logo_wrap}>
              <img src="/logo.png" alt="한평생 바로유학" className={styles.logo_img} />
            </div>
            <div className={styles.divider}>
              <span>새 비밀번호 설정</span>
            </div>

            <div className={styles.form_group}>
              <label className={styles.label}>
                새 비밀번호<span className={styles.required}>*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${styles.input} ${password && !isPasswordValid ? styles.input_error : ''}`}
                placeholder="최소 8자 이상"
              />
              {password && !isPasswordValid && (
                <div className={styles.error_message}>최소 8자 이상 입력해 주세요.</div>
              )}
            </div>

            <div className={styles.form_group}>
              <label className={styles.label}>
                비밀번호 확인<span className={styles.required}>*</span>
              </label>
              <input
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                className={`${styles.input} ${passwordConfirm && !isPasswordMatch ? styles.input_error : ''}`}
                placeholder="위 비밀번호와 동일하게 입력"
              />
              {passwordConfirm && !isPasswordMatch && (
                <div className={styles.error_message}>비밀번호가 일치하지 않습니다.</div>
              )}
            </div>

            <button
              className={styles.login_button}
              disabled={!isPasswordValid || !isPasswordMatch || !passwordConfirm || loading}
              onClick={handleResetPassword}
            >
              {loading ? '변경 중...' : '비밀번호 변경'}
            </button>
          </div>
        </div>
      </>
    )
  }

  // 번호 인증 화면
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
            <span>비밀번호 찾기</span>
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
              disabled={code.length !== 6 || verifying || timer === 0}
              onClick={verifyCode}
            >
              {verifying ? '확인 중...' : '인증 확인'}
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
