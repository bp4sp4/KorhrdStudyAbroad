'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './terms.module.css'
import { termsData } from '../../(main)/terms/termsData'
import { privacyData } from '../../(main)/privacy/privacyData'

const buildContent = (data: { title: string; content: string }[]) =>
  data.map((d) => `${d.title}\n${d.content}`).join('\n\n')

const TERMS = [
  {
    id: 'age',
    label: '(필수) 만 14세 이상 확인',
    required: true,
    content: `한평생유학은 만 14세 미만 아동의 서비스 이용을 제한하고 있습니다.\n\n개인정보 보호법에는 만 14세 미만 아동의 개인정보 수집 시 법정대리인 동의를 받도록 규정하고 있으며, 만 14세 미만 아동이 법정대리인 동의없이 회원가입을 하는 경우 회원탈퇴 또는 서비스 이용이 제한될 수 있음을 알려드립니다.`,
  },
  {
    id: 'service',
    label: '(필수) 서비스 이용약관',
    required: true,
    content: buildContent(termsData),
  },
  {
    id: 'privacy',
    label: '(필수) 개인정보 수집 및 이용 동의',
    required: true,
    content: buildContent(privacyData),
  },
]

const ChevronIcon = ({ up }: { up: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
    style={{ transition: 'transform 0.2s', transform: up ? 'rotate(0deg)' : 'rotate(180deg)', flexShrink: 0 }}
  >
    <path d="M17 14L12 9L7 14" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default function SignupTermsPage() {
  const router = useRouter()
  const [checked, setChecked] = useState<Record<string, boolean>>({ service: false, privacy: false, age: false })
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ service: false, privacy: false, age: false })

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
            <div className={styles.term_row}>
              {/* 체크박스 + 텍스트 — 클릭 시 체크 */}
              <span
                className={`${styles.checkbox} ${checked[term.id] ? styles.checked : ''}`}
                onClick={() => setChecked((p) => ({ ...p, [term.id]: !p[term.id] }))}
              />
              <span
                className={styles.term_text}
                onClick={() => setChecked((p) => ({ ...p, [term.id]: !p[term.id] }))}
              >
                {term.label}
              </span>

              {/* 자세히보기 — 클릭 시 아코디언 토글 */}
              <button
                className={styles.detail_btn}
                onClick={() => setExpanded((p) => ({ ...p, [term.id]: !p[term.id] }))}
              >
                자세히보기
                <ChevronIcon up={expanded[term.id]} />
              </button>
            </div>

            {/* 약관 내용 — 슬라이드 아코디언 */}
            <div className={`${styles.terms_wrap} ${expanded[term.id] ? styles.open : ''}`}>
              <div className={styles.terms_content}>
                {term.content}
              </div>
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
