import PolicyLayout from '@/components/PolicyLayout/PolicyLayout'
import { termsData } from './termsData'
import styles from './terms.module.css'

export default function TermsPage() {
  return (
    <PolicyLayout>
      <h2 className={styles.doc_title}>이용약관</h2>
      {termsData.map((item) => (
        <section key={item.id} className={styles.section}>
          <h3 className={styles.section_title}>{item.title}</h3>
          <p className={styles.section_content} style={{ whiteSpace: 'pre-line' }}>{item.content}</p>
        </section>
      ))}
      <p className={styles.effective_date}>시행일자: 2026년 4월 14일</p>
    </PolicyLayout>
  )
}
