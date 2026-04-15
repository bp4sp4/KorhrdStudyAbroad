'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import AlertModal from '@/components/AlertModal/AlertModal'
import styles from './form.module.css'

function SignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const phone = searchParams.get('phone') || ''

  const [formData, setFormData] = useState({ email: '', password: '', passwordConfirm: '', full_name: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [errors, setErrors] = useState({ email: '', password: '', passwordConfirm: '', full_name: '' })
  const [touched, setTouched] = useState({ email: false, password: false, passwordConfirm: false, full_name: false })

  const validate = {
    email: (v: string) => !v ? '' : !v.includes('@') ? '올바른 이메일 주소를 입력해 주세요.' : '',
    password: (v: string) => !v ? '' : v.length < 8 ? '최소 8자 이상 입력해 주세요.' : '',
    passwordConfirm: (v: string) => !v ? '' : v !== formData.password ? '비밀번호가 일치하지 않습니다.' : '',
    full_name: (v: string) => !v ? '' : v.length < 2 ? '이름을 2자 이상 입력해 주세요.' : '',
  }

  const handleChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: validate[field](value) }))
    if (!touched[field]) setTouched((prev) => ({ ...prev, [field]: true }))
  }

  const isFormValid =
    formData.email && formData.password && formData.passwordConfirm && formData.full_name &&
    !errors.email && !errors.password && !errors.passwordConfirm && !errors.full_name

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.')
      setShowModal(true)
      return
    }
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: { data: { full_name: formData.full_name, phone } },
    })
    if (error) {
      setError(error.message)
      setShowModal(true)
      setLoading(false)
      return
    }
    router.push('/signup/success')
  }

  const FIELDS = [
    { id: 'email',           label: '이메일',        type: 'text',     placeholder: 'abc@example.com' },
    { id: 'password',        label: '비밀번호',       type: 'password', placeholder: '최소 8자 이상' },
    { id: 'passwordConfirm', label: '비밀번호 확인',  type: 'password', placeholder: '위 비밀번호와 동일하게 입력' },
    { id: 'full_name',       label: '이름',           type: 'text',     placeholder: '실명을 입력해 주세요' },
  ] as const

  return (
    <>
      {showModal && <AlertModal message={error} onClose={() => setShowModal(false)} />}
      <div className={styles.container}>
        <div className={styles.inner}>
          <h2 className={styles.title}>필수 정보 입력</h2>
          <p className={styles.desc}>가입을 위해 필수 정보를 입력해 주세요.</p>

          <form onSubmit={handleSubmit}>
            {FIELDS.map(({ id, label, type, placeholder }) => (
              <div className={styles.field} key={id}>
                <label htmlFor={id} className={styles.label}>
                  {label}<span className={styles.required}>*</span>
                </label>
                <input
                  id={id}
                  type={type}
                  placeholder={placeholder}
                  value={formData[id]}
                  onChange={handleChange(id)}
                  onBlur={() => setTouched((prev) => ({ ...prev, [id]: true }))}
                  className={`${styles.input} ${errors[id] && touched[id] ? styles.input_error : ''}`}
                />
                {errors[id] && touched[id] && (
                  <p className={styles.error}>{errors[id]}</p>
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={!isFormValid || loading}
              className={styles.btn}
            >
              {loading ? '처리 중...' : '확인'}
            </button>
          </form>

          <p className={styles.login_link}>
            이미 계정이 있으신가요?{' '}
            <Link href="/login">로그인</Link>
          </p>
        </div>
      </div>
    </>
  )
}

export default function SignupFormPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  )
}
