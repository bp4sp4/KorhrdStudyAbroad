import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const clientId = process.env.NAVER_CLIENT_ID
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/naver/callback`
  const state = crypto.randomUUID()

  const response = new Response(null, {
    status: 302,
    headers: {
      'Set-Cookie': `naver_oauth_state=${state}; Path=/; HttpOnly; SameSite=Lax`,
      Location: `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`,
    },
  })

  return response
}
