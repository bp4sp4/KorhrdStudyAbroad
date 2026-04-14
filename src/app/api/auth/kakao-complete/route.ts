import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json()

    if (!phone) {
      return NextResponse.json({ error: '전화번호가 없습니다.' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: '인증되지 않은 사용자입니다.' }, { status: 401 })
    }

    const admin = createAdminClient()

    // phone_verifications에서 인증 완료 기록 확인
    const { data: verification } = await admin
      .from('phone_verifications')
      .select('id')
      .eq('phone', phone)
      .eq('verified', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (!verification) {
      return NextResponse.json({ error: '전화번호 인증이 완료되지 않았습니다.' }, { status: 400 })
    }

    const provider = user.user_metadata?.provider === 'naver' ? 'naver' : 'kakao'

    // profiles 생성 (소셜 로그인은 여기서 최초 생성)
    const { error: profileError } = await admin
      .from('profiles')
      .upsert({
        id: user.id,
        email: user.email ?? null,
        full_name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
        phone,
        login_provider: provider,
      }, { onConflict: 'id' })

    if (profileError) {
      console.error('profile upsert error:', profileError)
      return NextResponse.json({ error: '프로필 저장에 실패했습니다.' }, { status: 500 })
    }

    // 유저 메타데이터에 phone_verified 저장
    const { error } = await admin.auth.admin.updateUserById(user.id, {
      user_metadata: {
        ...user.user_metadata,
        phone,
        phone_verified: true,
      },
    })

    if (error) {
      return NextResponse.json({ error: '저장에 실패했습니다.' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('kakao-complete error:', err)
    return NextResponse.json({ error: '오류가 발생했습니다.' }, { status: 500 })
  }
}
