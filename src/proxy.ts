import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  // API 라우트, 서버 액션은 건너뜀
  const pathname = request.nextUrl.pathname
  if (pathname.startsWith('/api/')) {
    return NextResponse.next({ request })
  }
  const isServerAction = request.headers.get('next-action') !== null
  if (isServerAction) {
    return NextResponse.next({ request })
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // /admin/login 제외한 admin 라우트 보호
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!profile?.is_admin) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      url.searchParams.set('error', '관리자 권한이 없습니다')
      return NextResponse.redirect(url)
    }
  }

  // 로그인한 관리자가 /admin/login 접근 시 대시보드로
  if (pathname.startsWith('/admin/login') && user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (profile?.is_admin) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/dashboard'
      return NextResponse.redirect(url)
    }
  }

  // 일반 보호 라우트
  const protectedRoutes = ['/profile', '/mypage', '/apply']
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )

  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // 로그인한 사용자가 /login, /signup 접근 시 (소셜 약관동의 플로우, 가입완료 페이지 제외)
  const authRoutes = ['/login', '/signup']
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))
  const isSocialSignup = pathname === '/signup' && request.nextUrl.searchParams.has('provider')
  const isSignupSuccess = pathname === '/signup/success'

  if (isAuthRoute && user && !isSocialSignup && !isSignupSuccess) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
