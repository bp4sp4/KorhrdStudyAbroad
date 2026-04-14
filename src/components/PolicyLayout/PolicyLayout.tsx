'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import styles from './PolicyLayout.module.css'

interface PolicyLayoutProps {
  children: React.ReactNode
}

export default function PolicyLayout({ children }: PolicyLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <div className={styles.wrapper}>
      <div className={styles.inner}>
        <div className={styles.title_row}>
          <h1 className={styles.page_title}>서비스 정책</h1>
          <select className={styles.version_select} defaultValue="current">
            <option value="current">2026.04.14 서비스 시행문서 (최신)</option>
          </select>
        </div>

        <div className={styles.tab_bar}>
          <Link
            href="/terms"
            className={`${styles.tab} ${pathname === '/terms' ? styles.tab_active : ''}`}
          >
            이용약관
          </Link>
          <Link
            href="/privacy"
            className={`${styles.tab} ${pathname === '/privacy' ? styles.tab_active : ''}`}
          >
            개인정보처리방침
          </Link>
        </div>

        <div className={styles.content_box}>
          {children}
        </div>

        <div className={styles.back_wrap}>
          <button className={styles.back_btn} onClick={() => router.back()}>
            뒤로가기
          </button>
        </div>
      </div>
    </div>
  )
}
