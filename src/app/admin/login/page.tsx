import { adminLogin } from '@/app/admin/actions'
import styles from './page.module.css'

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams

  return (
    <div className={styles.container}>
      <div className={styles.wrap}>
        <div className={styles.header}>
          <h1 className={styles.title}>관리자 로그인</h1>
          <p className={styles.subtitle}>korhrdabroad Admin</p>
        </div>

        {params.error && (
          <p className={styles.message_error}>{params.error}</p>
        )}

        <form action={adminLogin} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>이메일</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="admin@example.com"
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>비밀번호</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className={styles.input}
            />
          </div>

          <button type="submit" className={styles.btn_submit}>
            로그인
          </button>
        </form>
      </div>
    </div>
  )
}
