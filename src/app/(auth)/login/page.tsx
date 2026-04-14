'use client'

import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import styles from '../auth.module.css'

const KakaoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="#3C1E1E" viewBox="0 0 21 21">
    <path fill="current" d="M10.5 3.217c4.514 0 8 2.708 8 6.004 0 3.758-4.045 6.184-8 5.892-1.321-.093-1.707-.17-2.101-.23-1.425.814-2.728 2.344-3.232 2.334-.325-.19.811-2.896.533-3.114-.347-.244-3.157-1.329-3.2-4.958 0-3.199 3.486-5.928 8-5.928Z" />
  </svg>
)

const NaverIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="none" viewBox="0 0 21 21">
    <path fill="#fff" d="M4 16.717h4.377V9.98l4.203 6.737H17v-13h-4.377v6.737l-4.16-6.737H4v13Z" />
  </svg>
)

const EmailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 20 16" fill="none">
    <path d="M2 16C1.45 16 0.979333 15.8043 0.588 15.413C0.196667 15.0217 0.000666667 14.5507 0 14V2C0 1.45 0.196 0.979333 0.588 0.588C0.98 0.196666 1.45067 0.000666667 2 0H18C18.55 0 19.021 0.196 19.413 0.588C19.805 0.98 20.0007 1.45067 20 2V14C20 14.55 19.8043 15.021 19.413 15.413C19.0217 15.805 18.5507 16.0007 18 16H2ZM10 9L2 4V14H18V4L10 9ZM10 7L18 2H2L10 7ZM2 4V2V14V4Z" fill="white" />
  </svg>
)

const PersonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 0C9.06087 0 10.0783 0.421427 10.8284 1.17157C11.5786 1.92172 12 2.93913 12 4C12 5.06087 11.5786 6.07828 10.8284 6.82843C10.0783 7.57857 9.06087 8 8 8C6.93913 8 5.92172 7.57857 5.17157 6.82843C4.42143 6.07828 4 5.06087 4 4C4 2.93913 4.42143 1.92172 5.17157 1.17157C5.92172 0.421427 6.93913 0 8 0ZM8 2C7.46957 2 6.96086 2.21071 6.58579 2.58579C6.21071 2.96086 6 3.46957 6 4C6 4.53043 6.21071 5.03914 6.58579 5.41421C6.96086 5.78929 7.46957 6 8 6C8.53043 6 9.03914 5.78929 9.41421 5.41421C9.78929 5.03914 10 4.53043 10 4C10 3.46957 9.78929 2.96086 9.41421 2.58579C9.03914 2.21071 8.53043 2 8 2ZM8 9C10.67 9 16 10.33 16 13V16H0V13C0 10.33 5.33 9 8 9ZM8 10.9C5.03 10.9 1.9 12.36 1.9 13V14.1H14.1V13C14.1 12.36 10.97 10.9 8 10.9Z" fill="white" />
  </svg>
)

export default function LoginPage() {
  const handleKakaoLogin = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  const handleNaverLogin = () => {
    window.location.href = '/api/auth/naver'
  }

  return (
    <div className={styles.card}>
      <div className={styles.container}>
        <div className={styles.logo_wrap}>
          <img src="/logo.png" alt="한평생유학" className={styles.logo_img} />
        </div>
        <div className={styles.divider}>
          <span>로그인/회원가입</span>
        </div>

        <div className={styles.social_buttons}>
          <button
            type="button"
            onClick={handleKakaoLogin}
            className={styles.kakao_button}
            style={{ display: 'none' }}
          >
            <KakaoIcon />
            카카오로 시작하기
          </button>
          <button
            type="button"
            onClick={handleNaverLogin}
            className={styles.naver_button}
            style={{ display: 'none' }}
          >
            <NaverIcon />
            네이버로 시작하기
          </button>
          <Link href="/login/email" className={styles.email_button}>
            <EmailIcon />
            로그인
          </Link>
          <Link href="/signup" className={styles.signup_button}>
            <PersonIcon />
            회원가입
          </Link>
        </div>
      </div>
    </div>
  )
}
