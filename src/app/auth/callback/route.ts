import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const { data: { user } } = await supabase.auth.getUser()

      // 카카오 로그인
      if (user?.app_metadata?.provider === 'kakao') {
        // profiles 테이블에 phone이 있으면 가입 완료된 유저
        const { data: profile } = await supabase
          .from('profiles')
          .select('phone')
          .eq('id', user.id)
          .single()

        if (!profile?.phone) {
          return NextResponse.redirect(`${origin}/signup?provider=kakao`)
        }
        return NextResponse.redirect(`${origin}/`)
      }

      // 네이버 로그인 — 콜백에서 이미 프로필 저장 완료, 바로 메인
      if (user?.user_metadata?.provider === 'naver') {
        return NextResponse.redirect(`${origin}/`)
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=인증에 실패했습니다`)
}
