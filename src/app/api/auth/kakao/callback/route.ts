import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  if (error || !code || !state) {
    return NextResponse.redirect(`${origin}/login?error=kakao_oauth_failed`)
  }

  // state 검증 (CSRF 방어)
  const cookieState = request.cookies.get('kakao_oauth_state')?.value
  if (!cookieState || cookieState !== state) {
    return NextResponse.redirect(`${origin}/login?error=kakao_oauth_failed`)
  }

  try {
    // 카카오 액세스 토큰 발급
    const tokenParams: Record<string, string> = {
      grant_type: 'authorization_code',
      client_id: process.env.KAKAO_REST_API_KEY || '',
      redirect_uri: `${origin}/api/auth/kakao/callback`,
      code,
    }
    if (process.env.KAKAO_CLIENT_SECRET) {
      tokenParams.client_secret = process.env.KAKAO_CLIENT_SECRET
    }

    const tokenResponse = await fetch('https://kauth.kakao.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(tokenParams),
    })

    const tokenData = await tokenResponse.json()
    if (!tokenData.access_token) {
      throw new Error('Failed to get kakao access token')
    }

    // 카카오 사용자 정보 조회
    const userResponse = await fetch('https://kapi.kakao.com/v2/user/me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })

    const userData = await userResponse.json()
    const kakaoAccount = userData.kakao_account

    const userEmail = kakaoAccount?.email || `kakao_${userData.id}@kakao.user`
    const userName = kakaoAccount?.name || kakaoAccount?.profile?.nickname || ''
    const rawPhone = kakaoAccount?.phone_number || ''

    // 전화번호 정규화: +82 10-1234-5678 → 01012345678
    const digits = rawPhone.replace(/[^0-9]/g, '')
    const phone = digits.startsWith('82') ? '0' + digits.slice(2) : digits

    const admin = createAdminClient()

    // 기존 유저 확인
    const { data: existingProfile } = await admin
      .from('profiles')
      .select('id, phone')
      .eq('email', userEmail)
      .single()

    if (!existingProfile) {
      // 신규 유저 생성
      const { data: newUserData, error: createError } = await admin.auth.admin.createUser({
        email: userEmail,
        email_confirm: true,
        user_metadata: {
          full_name: userName,
          provider: 'kakao',
          phone_number: phone,
        },
      })

      if (createError && !createError.message?.includes('already been registered')) {
        throw new Error(`Failed to create user: ${createError.message}`)
      }

      // createUser 반환값 or 이미 있는 유저 이메일로 조회
      let userId = newUserData?.user?.id
      if (!userId) {
        const { data: { users } } = await admin.auth.admin.listUsers({ perPage: 1000 })
        userId = users.find((u) => u.email === userEmail)?.id
      }

      if (userId && phone) {
        await admin.from('profiles').upsert({
          id: userId,
          email: userEmail,
          full_name: userName,
          phone,
          login_provider: 'kakao',
        }, { onConflict: 'id' })

        await admin.auth.admin.updateUserById(userId, {
          user_metadata: {
            full_name: userName,
            provider: 'kakao',
            phone_number: phone,
            phone_verified: true,
          },
        })
      }
    }

    // 매직링크로 세션 생성
    const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
      type: 'magiclink',
      email: userEmail,
      options: { redirectTo: `${origin}/kakao-callback` },
    })

    if (linkError || !linkData.properties?.action_link) {
      throw new Error('Failed to generate magic link')
    }

    const response = NextResponse.redirect(linkData.properties.action_link)
    response.cookies.delete('kakao_oauth_state')
    return response
  } catch (err) {
    console.error('Kakao OAuth error:', err)
    return NextResponse.redirect(`${origin}/login?error=kakao_oauth_failed`)
  }
}
