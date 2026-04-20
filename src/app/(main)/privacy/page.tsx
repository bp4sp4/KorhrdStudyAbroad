import PolicyLayout from '@/components/PolicyLayout/PolicyLayout'
import { privacyData } from './privacyData'
import styles from './privacy.module.css'

export default function PrivacyPage() {
  return (
    <PolicyLayout>
      <h2 className={styles.doc_title}>개인정보처리방침</h2>
      {privacyData.map((item) => (
        <section key={item.id} className={styles.section}>
          <h3 className={styles.section_title}>{item.title}</h3>
          <p className={styles.section_content} style={{ whiteSpace: 'pre-line' }}>{item.content}</p>
        </section>
      ))}
      <section className={styles.section}>
        <p className={styles.effective_date}>
          <strong>공고일자:</strong> 2026년 4월 14일<br />
          <strong>시행일자:</strong> 2026년 4월 14일
        </p>
      </section>
    </PolicyLayout>
  )
}
