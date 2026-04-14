'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import styles from './naver-callback.module.css'

export default function NaverCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    const go = async (userId: string) => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('phone')
        .eq('id', userId)
        .single()

      if (profile?.phone) {
        router.replace('/')
      } else {
        router.replace('/signup?provider=naver')
      }
    }

    const handle = async () => {
      // 1. URL hash에서 access_token 직접 파싱 (implicit flow)
      const hash = window.location.hash.substring(1)
      const params = new URLSearchParams(hash)
      const accessToken = params.get('access_token')
      const refreshToken = params.get('refresh_token')

      if (accessToken && refreshToken) {
        const { data: { session }, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        })
        if (session?.user) {
          go(session.user.id)
          return
        }
        if (error) console.error('setSession error:', error)
      }

      // 2. PKCE: URL query에 code가 있는 경우
      const searchParams = new URLSearchParams(window.location.search)
      const code = searchParams.get('code')
      if (code) {
        const { data: { session } } = await supabase.auth.exchangeCodeForSession(code)
        if (session?.user) {
          go(session.user.id)
          return
        }
      }

      // 3. 이미 세션이 있는 경우
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        go(session.user.id)
      }
    }

    handle()
  }, [router])

  return (
    <div className={styles.wrap}>
      <p className={styles.text}>로그인 처리 중...</p>
    </div>
  )
}
