'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import AlertModal from '@/components/AlertModal/AlertModal'
import styles from '../../auth.module.css'

export default function EmailLoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [touched, setTouched] = useState({ email: false, password: false })

  const validateEmail = (email: string) => {
    if (!email) return ''
    if (!email.includes('@')) return '올바른 이메일 주소를 입력해 주세요.'
    return ''
  }

  const validatePassword = (password: string) => {
    if (!password) return ''
    if (password.length < 8) return '8자 이상 입력해 주세요.'
    return ''
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value
    setFormData({ ...formData, email })
    setEmailError(validateEmail(email))
    if (!touched.email) setTouched({ ...touched, email: true })
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value
    setFormData({ ...formData, password })
    setPasswordError(validatePassword(password))
    if (!touched.password) setTouched({ ...touched, password: true })
  }

  const isFormValid = formData.email && formData.password && !emailError && !passwordError

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    })

    if (error) {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.')
      setShowModal(true)
      setLoading(false)
      return
    }

    router.push('/')
    router.refresh()
  }

  return (
    <>
      {showModal && <AlertModal message={error} onClose={() => setShowModal(false)} />}
      <div className={styles.card}>
        <div className={styles.container}>
          <div className={styles.logo_wrap}>
            <img src="/logo.png" alt="한평생 바로유학" className={styles.logo_img} />
          </div>
          <div className={styles.divider}>
            <span>이메일 로그인</span>
          </div>

          <form onSubmit={handleSubmit}>
            <div className={styles.form_group}>
              <label htmlFor="email" className={styles.label}>
                이메일<span className={styles.required}>*</span>
              </label>
              <input
                id="email"
                type="text"
                placeholder="abc@example.com"
                value={formData.email}
                onChange={handleEmailChange}
                onBlur={() => setTouched({ ...touched, email: true })}
                className={`${styles.input} ${emailError && touched.email ? styles.input_error : ''}`}
              />
              {emailError && touched.email && (
                <div className={styles.error_message}>{emailError}</div>
              )}
            </div>

            <div className={styles.form_group}>
              <label htmlFor="password" className={styles.label}>
                비밀번호<span className={styles.required}>*</span>
              </label>
              <input
                id="password"
                type="password"
                placeholder="비밀번호를 입력하세요."
                value={formData.password}
                onChange={handlePasswordChange}
                onBlur={() => setTouched({ ...touched, password: true })}
                className={`${styles.input} ${passwordError && touched.password ? styles.input_error : ''}`}
              />
              {passwordError && touched.password && (
                <div className={styles.error_message}>{passwordError}</div>
              )}
            </div>

            <div className={styles.form_actions}>
              <Link href="/find-email" className={styles.reset_link}>이메일 찾기</Link>
              <div className={styles.divider_small}>/</div>
              <Link href="/find-password" className={styles.reset_link}>비밀번호 재설정</Link>
            </div>

            <button
              type="submit"
              disabled={!isFormValid || loading}
              className={styles.login_button}
            >
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          <div className={styles.signup_wrap}>
            <Link href="/login" className={styles.signup_link}>← 돌아가기</Link>
          </div>
        </div>
      </div>
    </>
  )
}
