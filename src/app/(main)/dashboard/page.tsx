import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import styles from './page.module.css'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className={styles.container}>
      <div className={styles.wrap}>
        <h1 className={styles.title}>대시보드</h1>

        <div className={styles.profile_card}>
          <h2 className={styles.profile_title}>내 정보</h2>
          <p className={styles.profile_text}>이메일: {user.email}</p>
          {user.user_metadata?.full_name && (
            <p className={styles.profile_text}>이름: {user.user_metadata.full_name}</p>
          )}
        </div>
      </div>
    </div>
  )
}
