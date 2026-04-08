'use client'

import { useState, useTransition, useRef } from 'react'
import { submitConsultation } from './actions'
import styles from './page.module.css'

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length < 4) return digits
  if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
}

interface Props {
  onClose: () => void
}

export default function ConsultModal({ onClose }: Props) {
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<{ success?: boolean; error?: string } | null>(null)
  const [phone, setPhone] = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const res = await submitConsultation(formData)
      setResult(res)
      if (res.success) { formRef.current?.reset(); setPhone('') }
    })
  }

  return (
    <div className={styles.modal_overlay} onClick={onClose}>
      <div className={styles.modal_box} onClick={e => e.stopPropagation()}>

        {result?.success ? (
          <div className={styles.modal_success}>
            <div className={styles.consult_popup_icon}>✓</div>
            <h3 className={styles.consult_popup_title}>신청되었습니다!</h3>
            <p className={styles.consult_popup_desc}>
              무료 상담 신청이 완료되었습니다.<br />
              빠른 시일 내에 연락드리겠습니다.
            </p>
            <button className={styles.consult_popup_btn} onClick={onClose}>
              확인
            </button>
          </div>
        ) : (
          <>
            <div className={styles.modal_header}>
              <h2 className={styles.modal_title}>간편상담신청</h2>
              <button className={styles.modal_close} onClick={onClose}>×</button>
            </div>

            <form className={styles.modal_form} ref={formRef} onSubmit={handleSubmit}>
              <div className={styles.form_field}>
                <label className={styles.form_label}>이름 <span className={styles.form_required}>*</span></label>
                <input name="name" className={styles.form_input} type="text" placeholder="예) 홍길동" required />
              </div>
              <div className={styles.form_field}>
                <label className={styles.form_label}>연락처 <span className={styles.form_required}>*</span></label>
                <input
                  name="phone"
                  className={styles.form_input}
                  type="tel"
                  placeholder="예) 010-0000-0000"
                  value={phone}
                  onChange={e => setPhone(formatPhone(e.target.value))}
                  required
                />
              </div>
              <div className={styles.form_field}>
                <label className={styles.form_label}>거주지역 <span className={styles.form_required}>*</span></label>
                <input name="region" className={styles.form_input} type="text" placeholder="예) 서울시 도봉구" required />
              </div>
              <div className={styles.form_field}>
                <label className={styles.form_label}>희망 시작일 <span className={styles.form_required}>*</span></label>
                <input name="desired_start" className={styles.form_input} type="text" placeholder="예) 2026년 4월" required />
              </div>
              <div className={styles.form_field_large}>
                <label className={styles.form_label}>문의사항 <span className={styles.form_required}>*</span></label>
                <textarea
                  name="message"
                  className={styles.form_textarea}
                  placeholder="구체적인 내용을 적어주시면 상세한 상담이 가능합니다."
                  required
                />
              </div>

              <label className={styles.privacy_row}>
                <a href="/privacy" className={styles.privacy_link} target="_blank" rel="noopener noreferrer">개인정보처리방침</a>
                <span className={styles.privacy_agree}>동의</span>
                <input name="privacy_agreed" type="checkbox" className={styles.privacy_input} required />
                <span className={styles.privacy_checkbox}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <g clipPath="url(#clip0_modal_222)">
                      <path fillRule="evenodd" clipRule="evenodd" d="M9.69591 2.29991C9.82245 2.42649 9.89354 2.59815 9.89354 2.77713C9.89354 2.95612 9.82245 3.12778 9.69591 3.25436L4.63656 8.31371C4.5697 8.38058 4.49032 8.43363 4.40295 8.46983C4.31559 8.50602 4.22195 8.52465 4.12738 8.52465C4.03282 8.52465 3.93918 8.50602 3.85181 8.46983C3.76445 8.43363 3.68507 8.38058 3.61821 8.31371L1.10451 5.80046C1.04004 5.73819 0.988615 5.66371 0.953239 5.58135C0.917863 5.499 0.899242 5.41043 0.898463 5.3208C0.897684 5.23118 0.914763 5.14229 0.948702 5.05934C0.982642 4.97638 1.03276 4.90102 1.09614 4.83764C1.15952 4.77426 1.23488 4.72414 1.31784 4.6902C1.40079 4.65626 1.48968 4.63918 1.5793 4.63996C1.66893 4.64074 1.7575 4.65936 1.83986 4.69474C1.92221 4.73011 1.99669 4.78154 2.05896 4.84601L4.12716 6.91421L8.74101 2.29991C8.80369 2.23718 8.87812 2.18742 8.96005 2.15347C9.04197 2.11952 9.12978 2.10205 9.21846 2.10205C9.30714 2.10205 9.39495 2.11952 9.47687 2.15347C9.55879 2.18742 9.63322 2.23718 9.69591 2.29991Z" fill="#D0D0D0"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_modal_222">
                        <rect width="10.8" height="10.8" fill="white"/>
                      </clipPath>
                    </defs>
                  </svg>
                </span>
              </label>

              {result?.error && (
                <p className={styles.consult_error}>{result.error}</p>
              )}

              <button type="submit" className={styles.form_submit} disabled={isPending}>
                {isPending ? '신청 중...' : '무료상담 신청하기'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
