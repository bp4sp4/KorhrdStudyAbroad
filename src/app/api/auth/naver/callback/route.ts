import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  if (error || !code || !state) {
    return NextResponse.redirect(`${origin}/login?error=naver_oauth_failed`)
  }

  // state 검증 (CSRF 방어)
  const cookieState = request.cookies.get('naver_oauth_state')?.value
  if (!cookieState || cookieState !== state) {
    return NextResponse.redirect(`${origin}/login?error=naver_oauth_failed`)
  }

  try {
    // 네이버 액세스 토큰 발급
    const tokenResponse = await fetch('https://nid.naver.com/oauth2.0/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.NAVER_CLIENT_ID || '',
        client_secret: process.env.NAVER_CLIENT_SECRET || '',
        code,
        state,
      }),
    })

    const tokenData = await tokenResponse.json()
    if (!tokenData.access_token) {
      throw new Error('Failed to get naver access token')
    }

    // 네이버 사용자 정보 조회
    const userResponse = await fetch('https://openapi.naver.com/v1/nid/me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })

    const userData = await userResponse.json()
    if (userData.resultcode !== '00') {
      throw new Error('Failed to get naver user info')
    }

    const naverUser = userData.response
    // 이메일 없는 계정은 네이버 고유 ID로 가상 이메일 생성
    const userEmail = naverUser.email || `naver_${naverUser.id}@naver.user`

    const supabaseAdmin = createAdminClient()

    // profiles 테이블로 이메일 조회
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', userEmail)
      .single()

    if (existingProfile) {
      // 기존 유저 phone_number 메타데이터 최신화
      const { data: existingUser } = await supabaseAdmin.auth.admin.getUserById(existingProfile.id)
      if (existingUser?.user && !existingUser.user.user_metadata?.phone_number && naverUser.mobile) {
        await supabaseAdmin.auth.admin.updateUserById(existingProfile.id, {
          user_metadata: {
            ...existingUser.user.user_metadata,
            phone_number: naverUser.mobile,
          },
        })
      }
    } else {
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: userEmail,
        email_confirm: true,
        user_metadata: {
          full_name: naverUser.name || naverUser.nickname,
          avatar_url: naverUser.profile_image,
          provider: 'naver',
          phone_number: naverUser.mobile || '',
        },
      })

      if (createError) {
        // auth.users에 이미 있는 경우 → 이메일로 매직링크 생성 가능, 계속 진행
        if (!createError.message?.includes('already been registered')) {
          throw new Error(`Failed to create user: ${createError.message}`)
        }
      } else if (!newUser.user) {
        throw new Error('User creation returned empty')
      }
    }

    // Supabase 매직링크로 세션 생성
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: userEmail,
      options: { redirectTo: `${origin}/naver-callback` },
    })

    if (linkError || !linkData.properties?.action_link) {
      throw new Error('Failed to generate magic link')
    }

    // state 쿠키 삭제 후 리디렉트
    const response = NextResponse.redirect(linkData.properties.action_link)
    response.cookies.delete('naver_oauth_state')
    return response
  } catch (err) {
    console.error('Naver OAuth error:', err)
    return NextResponse.redirect(`${origin}/login?error=naver_oauth_failed`)
  }
}
