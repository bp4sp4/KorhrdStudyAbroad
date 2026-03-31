import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

const VERIFIED_WINDOW_MS = 10 * 60 * 1000 // 10분

export async function POST(request: NextRequest) {
  const { full_name, phone, password } = await request.json()

  if (!full_name || !phone || !password) {
    return NextResponse.json({ error: '필수 정보가 누락되었습니다.' }, { status: 400 })
  }

  if (password.length < 8) {
    return NextResponse.json({ error: '비밀번호는 최소 8자 이상이어야 합니다.' }, { status: 400 })
  }

  const supabase = createAdminClient()

  // SMS 인증 완료 여부 검증 (10분 이내)
  const since = new Date(Date.now() - VERIFIED_WINDOW_MS).toISOString()
  const { data: verification } = await supabase
    .from('phone_verifications')
    .select('id')
    .eq('phone', phone)
    .eq('verified', true)
    .gt('updated_at', since)
    .order('updated_at', { ascending: false })
    .limit(1)
    .single()

  if (!verification) {
    return NextResponse.json({ error: '휴대폰 인증을 먼저 완료해 주세요.' }, { status: 403 })
  }

  // 이름 + 번호로 유저 찾기
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('full_name', full_name)
    .eq('phone', phone)
    .single()

  if (profileError || !profile) {
    return NextResponse.json({ error: '입력하신 정보와 일치하는 계정을 찾을 수 없습니다.' }, { status: 404 })
  }

  const { error: updateError } = await supabase.auth.admin.updateUserById(profile.id, { password })

  if (updateError) {
    return NextResponse.json({ error: '비밀번호 변경에 실패했습니다.' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
