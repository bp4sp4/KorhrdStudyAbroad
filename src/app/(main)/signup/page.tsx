'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import styles from './terms.module.css'

const TERMS = [
  {
    id: 'service',
    label: '(필수) 이용약관',
    required: true,
    href: '/terms',
  },
  {
    id: 'privacy',
    label: '(필수) 개인정보 수집 및 이용 동의',
    required: true,
    href: '/privacy',
  },
]

const ChevronIcon = ({ up }: { up: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
    style={{ width: 24, height: 24, aspectRatio: '1/1', flexShrink: 0, transition: 'transform 0.2s', transform: up ? 'rotate(0deg)' : 'rotate(180deg)' }}>
    <path d="M17 14L12 9L7 14" stroke="#c4c4c4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default function SignupTermsPage() {
  const router = useRouter()
  const [checked, setChecked] = useState<Record<string, boolean>>({ service: false, privacy: false })
  const allChecked = TERMS.every((t) => checked[t.id])
  const requiredChecked = TERMS.filter((t) => t.required).every((t) => checked[t.id])

  const toggleAll = () => {
    const next = !allChecked
    setChecked(Object.fromEntries(TERMS.map((t) => [t.id, next])))
  }

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <h2 className={styles.title}>
          처음이라 조심스럽지만,<br />약관을 확인해 주세요.
        </h2>

        {/* 전체동의 */}
        <div className={styles.all_row} onClick={toggleAll}>
          <span className={`${styles.checkbox} ${allChecked ? styles.checked : ''}`} />
          <span className={styles.all_label}>약관 전체동의</span>
        </div>

        {/* 개별 항목 */}
        {TERMS.map((term) => (
          <div key={term.id}>
            <div
              className={styles.term_row}
              onClick={() => setChecked((p) => ({ ...p, [term.id]: !p[term.id] }))}
            >
              <span className={`${styles.checkbox} ${checked[term.id] ? styles.checked : ''}`} />
              <span className={styles.term_text}>{term.label}</span>
              <Link
                href={term.href}
                target="_blank"
                onClick={(e) => e.stopPropagation()}
              >
                <ChevronIcon up={false} />
              </Link>
            </div>
          </div>
        ))}

        <button
          className={styles.next_btn}
          disabled={!requiredChecked}
          onClick={() => router.push('/signup/phone')}
        >
          다음
        </button>
      </div>
    </div>
  )
}
