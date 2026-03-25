import Link from 'next/link'
import { termsData } from './termsData'
import styles from './terms.module.css'

export default function TermsPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/" className={styles.back_link}>← 홈으로</Link>
        <h1>이용약관</h1>
      </div>

      <div className={styles.content}>
        {termsData.map((item) => (
          <section key={item.id} className={styles.section}>
            <h2>{item.title}</h2>
            <p style={{ whiteSpace: 'pre-line' }}>{item.content}</p>
          </section>
        ))}
        <section className={styles.section}>
          <p className={styles.effective_date}>시행일자: 2026년 1월 29일</p>
        </section>
      </div>
    </div>
  )
}
