import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { origin } = new URL(request.url)
  const state = crypto.randomUUID()

  const params = new URLSearchParams({
    client_id: process.env.KAKAO_REST_API_KEY || '',
    redirect_uri: `${origin}/api/auth/kakao/callback`,
    response_type: 'code',
    state,
  })

  const response = NextResponse.redirect(
    `https://kauth.kakao.com/oauth/authorize?${params}`
  )
  response.cookies.set('kakao_oauth_state', state, {
    httpOnly: true,
    maxAge: 60 * 10,
    path: '/',
  })
  return response
}
