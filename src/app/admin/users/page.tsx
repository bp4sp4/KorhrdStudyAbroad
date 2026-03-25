import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { adminLogout } from '@/app/admin/actions'
import { createAdmin } from './actions'
import styles from './page.module.css'

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const params = await searchParams

  const adminClient = createAdminClient()
  const { data: users } = await adminClient
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.header_left}>
          <a href="/admin/dashboard" className={styles.header_back}>← 대시보드</a>
          <h1 className={styles.header_title}>관리자 계정 관리</h1>
        </div>
        <form action={adminLogout}>
          <button type="submit" className={styles.btn_logout}>로그아웃</button>
        </form>
      </header>

      <main className={styles.main}>
        <div className={styles.create_card}>
          <h2 className={styles.create_title}>새 관리자 계정 생성</h2>

          {params.error && <p className={styles.message_error}>{params.error}</p>}
          {params.success && <p className={styles.message_success}>{params.success}</p>}

          <form action={createAdmin} className={styles.form_grid}>
            <div className={styles.field}>
              <label className={styles.label}>이름</label>
              <input name="full_name" type="text" required placeholder="홍길동" className={styles.input} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>이메일</label>
              <input name="email" type="email" required placeholder="admin@example.com" className={styles.input} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>비밀번호</label>
              <input name="password" type="password" required minLength={6} placeholder="6자 이상" className={styles.input} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>&nbsp;</label>
              <button type="submit" className={styles.btn_create}>관리자 생성</button>
            </div>
          </form>
        </div>

        <div className={styles.table_wrap}>
          <div className={styles.table_header}>전체 계정 목록</div>
          <div className={styles.table_scroll}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>이름</th>
                  <th>이메일</th>
                  <th>가입일</th>
                  <th>권한</th>
                </tr>
              </thead>
              <tbody>
                {users?.map((u) => (
                  <tr key={u.id}>
                    <td>{u.full_name ?? '-'}</td>
                    <td className={styles.td_muted}>{u.email}</td>
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
