import Link from 'next/link'
import { privacyData } from './privacyData'
import styles from './privacy.module.css'

export default function PrivacyPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/" className={styles.back_link}>← 홈으로</Link>
        <h1>개인정보처리방침</h1>
      </div>

      <div className={styles.content}>
        {privacyData.map((item) => (
          <section key={item.id} className={styles.section}>
            <h2>{item.title}</h2>
            <p style={{ whiteSpace: 'pre-line' }}>{item.content}</p>
          </section>
        ))}
        <section className={styles.section}>
          <p className={styles.effective_date}>
            <strong>공고일자:</strong> 2026년 1월 29일<br />
            <strong>시행일자:</strong> 2026년 1월 29일
          </p>
        </section>
      </div>
    </div>
  )
}
