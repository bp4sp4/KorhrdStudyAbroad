import { createClient } from '@/lib/supabase/server'
import { logout } from '@/app/auth/actions'
import styles from './Header.module.css'

export default async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <a href="/" className={styles.logo}>korhrdabroad</a>

        <nav className={styles.nav}>
          {user ? (
            <>
              <span className={styles.user_email}>{user.email}</span>
              <form action={logout}>
                <button type="submit" className={styles.btn_logout}>로그아웃</button>
              </form>
            </>
          ) : (
            <a href="/login" className={styles.btn_login}>로그인/회원가입</a>
          )}
        </nav>
      </div>
    </header>
  )
}
