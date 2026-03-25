import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { adminLogout } from '@/app/admin/actions'
import styles from './page.module.css'

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin, full_name, email')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) redirect('/admin/login?error=관리자 권한이 없습니다')

  const { data: users, count } = await supabase
    .from('profiles')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.header_title}>korhrdabroad 관리자</h1>
        <div className={styles.header_right}>
          <span className={styles.header_email}>{profile.email}</span>
          <form action={adminLogout}>
            <button type="submit" className={styles.btn_logout}>로그아웃</button>
          </form>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.stats_grid}>
          <div className={styles.stat_card}>
            <p className={styles.stat_label}>전체 회원</p>
            <p className={styles.stat_value}>{count ?? 0}</p>
          </div>
          <a href="/admin/users" className={styles.stat_card_link}>
            <p className={styles.stat_label}>관리자 계정 관리</p>
            <p className={styles.stat_link}>계정 생성 / 목록 →</p>
          </a>
        </div>

        <div className={styles.table_wrap}>
          <div className={styles.table_header}>회원 목록</div>
          <div className={styles.table_scroll}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>이름</th>
                  <th>이메일</th>
                  <th>목표 국가</th>
                  <th>가입일</th>
                  <th>권한</th>
                </tr>
              </thead>
              <tbody>
                {users?.map((u) => (
                  <tr key={u.id}>
                    <td>{u.full_name ?? '-'}</td>
                    <td className={styles.td_muted}>{u.email}</td>
                    <td>{u.target_country ?? '-'}</td>
                    <td className={styles.td_date}>
                      {new Date(u.created_at).toLocaleDateString('ko-KR')}
                    </td>
                    <td>
                      {u.is_admin ? (
                        <span className={styles.badge_admin}>관리자</span>
                      ) : (
                        <span className={styles.badge_user}>일반</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
