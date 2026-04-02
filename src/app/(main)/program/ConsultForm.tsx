'use client'

import { useState } from 'react'
import Link from 'next/link'
import styles from './ConsultForm.module.css'
import { submitConsultation } from './actions'

export default function ConsultForm({ onClose }: { onClose?: () => void } = {}) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    region: '',
    startDate: '',
    inquiry: '',
    privacyAgree: false,
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11)
    if (digits.length < 4) return digits
    if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.privacyAgree) return
    setLoading(true)
    setError('')
    try {
      await submitConsultation({
        name: formData.name,
        phone: formData.phone,
        region: formData.region,
        desired_start: formData.startDate,
        message: formData.inquiry,
      })
      setSuccess(true)
    } catch {
      setError('신청 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setSuccess(false)
    setFormData({ name: '', phone: '', region: '', startDate: '', inquiry: '', privacyAgree: false })
    onClose?.()
  }

  return (
    <>
      <div className={styles.card}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <h3 className={styles.form_title}>간편상담신청</h3>

          <div className={styles.fields}>
            <div className={styles.field_group}>
              <label className={styles.label}>
                이름 <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                className={styles.input}
                placeholder="예) 홍길동"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className={styles.field_group}>
              <label className={styles.label}>
                연락처 <span className={styles.required}>*</span>
              </label>
              <input
                type="tel"
                className={styles.input}
                placeholder="예) 010-0000-0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: formatPhone(e.target.value) })}
                required
              />
            </div>

            <div className={styles.field_group}>
              <label className={styles.label}>
                거주지역 <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                className={styles.input}
                placeholder="예) 서울시 도봉구"
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                required
              />
            </div>

            <div className={styles.field_group}>
              <label className={styles.label}>
                희망 시작일 <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                className={styles.input}
                placeholder="예) 2026년 4월"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>

            <div className={styles.field_group} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <label className={styles.label}>
                문의사항 <span className={styles.required}>*</span>
              </label>
              <textarea
                className={styles.textarea}
                placeholder="구체적인 내용을 적어주시면 상세한 상담이 가능합니다."
                value={formData.inquiry}
                onChange={(e) => setFormData({ ...formData, inquiry: e.target.value })}
                required
              />
            </div>
          </div>

          <div className={styles.footer}>
            {error && <p className={styles.error_text}>{error}</p>}
            <div className={styles.privacy_row}>
              <Link href="/privacy" className={styles.privacy_link} target="_blank">개인정보처리방침</Link>
              <span className={styles.privacy_text}>동의</span>
              <input
                type="checkbox"
                className={styles.privacy_checkbox}
                checked={formData.privacyAgree}
                onChange={(e) => setFormData({ ...formData, privacyAgree: e.target.checked })}
              />
            </div>
            <button
              type="submit"
              className={styles.submit_btn}
              disabled={loading || !formData.privacyAgree}
            >
              {loading ? '신청 중...' : '무료상담 신청하기'}
            </button>
          </div>
        </form>
      </div>

      {success && (
        <div className={styles.overlay} onClick={handleClose}>
          <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
            <div className={styles.popup_icon}>✓</div>
            <h3 className={styles.popup_title}>신청되었습니다!</h3>
            <p className={styles.popup_desc}>
              무료 상담 신청이 완료되었습니다.<br />
              빠른 시일 내에 연락드리겠습니다.
            </p>
            <button className={styles.popup_btn} onClick={handleClose}>
              확인
            </button>
          </div>
        </div>
      )}
    </>
  )
}
