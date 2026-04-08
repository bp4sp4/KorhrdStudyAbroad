'use client'

import { useState } from 'react'
import { logout } from '@/app/auth/actions'
import styles from './Header.module.css'

export default function MobileMenu({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [open, setOpen] = useState(false)

  const close = () => setOpen(false)

  return (
    <>
      <button
        type="button"
        className={styles.hamburger_btn}
        aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M25 7L7 25M7 7L25 25" stroke="#010101" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M26.5 23C27.3284 23 28 23.6716 28 24.5C28 25.3284 27.3284 26 26.5 26H5.5C4.67157 26 4 25.3284 4 24.5C4 23.6716 4.67157 23 5.5 23H26.5ZM26.5 15C27.3284 15 28 15.6716 28 16.5C28 17.3284 27.3284 18 26.5 18H5.5C4.67157 18 4 17.3284 4 16.5C4 15.6716 4.67157 15 5.5 15H26.5ZM26.5 7C27.3284 7 28 7.67157 28 8.5C28 9.32843 27.3284 10 26.5 10H5.5C4.67157 10 4 9.32843 4 8.5C4 7.67157 4.67157 7 5.5 7H26.5Z" fill="black"/>
          </svg>
        )}
      </button>

      <div className={`${styles.mobile_drawer} ${open ? styles.mobile_drawer_open : ''}`}>
        <nav className={styles.mobile_nav}>
          <a href="/program" className={styles.mobile_nav_link} onClick={close}>프로그램</a>
          <a href="/apply" className={styles.mobile_nav_link} onClick={close}>참가신청</a>
          {isLoggedIn ? (
            <>
              <a href="/mypage" className={styles.mobile_nav_link} onClick={close}>마이페이지</a>
              <form action={logout}>
                <button type="submit" className={styles.mobile_nav_link_btn}>로그아웃</button>
              </form>
            </>
          ) : (
            <a href="/login" className={styles.mobile_nav_link} onClick={close}>로그인/회원가입</a>
          )}
        </nav>      </div>
    </>
  )
}
