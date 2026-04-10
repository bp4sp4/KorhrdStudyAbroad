'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import styles from './Footer.module.css'

export default function Footer() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  const hasBottomBar = mounted && (pathname === '/' || pathname.startsWith('/program'))
  return (
    <footer className={styles.footer} data-bottom-bar={hasBottomBar ? 'true' : undefined}>
      <p className={styles.company}>한평생유학</p>
      <p className={styles.info}>대표 양병웅 ｜ 사업자등록번호 227-88-03196</p>
      <p className={styles.info}>서울시 도봉구 창동 마들로13길 61 씨드큐브 905호</p>
      <p className={styles.info}>
        <a href="/terms" className={styles.link}>이용약관</a>
        {' ｜ '}
        <a href="/privacy" className={styles.link}>개인정보처리방침</a>
      </p>
      <p className={styles.copyright}>2026 © 한평생유학. All rights reserved.</p>
    </footer>
  )
}
