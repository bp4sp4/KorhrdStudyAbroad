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
      <p className={styles.company}>한평생그룹</p>
      <p className={styles.info}>대표 양병웅 ｜ 사업자등록번호 227-88-03196 ｜ 통신판매업 2024-서울도봉-0983</p>
      <p className={styles.info}>서울특별시 도봉구 마들로13길 61, 씨드큐브 창동 B동 9층 905, 906호</p>
      <p className={styles.info}>전자우편주소 : korhrdpartners@naver.com</p>
      <p className={styles.info}>
        <a href="/terms" className={styles.link}>이용약관</a>
        {' ｜ '}
        <a href="/privacy" className={styles.link}>개인정보처리방침</a>
        {' ｜ '}
        <a
          href="#"
          className={styles.link}
          onClick={(e) => { e.preventDefault(); window.open('http://www.ftc.go.kr/bizCommPop.do?wrkr_no=2278803196', 'bizCommPop', 'width=750,height=700'); }}
        >사업자정보확인</a>
      </p>
      <p className={styles.copyright}>2026 © 한평생그룹. All rights reserved.</p>
    </footer>
  )
}
