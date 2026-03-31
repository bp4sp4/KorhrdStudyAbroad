import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

const VERIFIED_WINDOW_MS = 10 * 60 * 1000 // 10분

export async function POST(request: NextRequest) {
  const { full_name, phone } = await request.json()

  if (!full_name || !phone) {
    return NextResponse.json({ error: '이름과 전화번호를 입력해주세요.' }, { status: 400 })
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

  const { data, error } = await supabase
    .from('profiles')
    .select('email')
    .eq('full_name', full_name)
    .eq('phone', phone)
    .single()

  if (error || !data?.email) {
    return NextResponse.json({ error: '입력하신 정보와 일치하는 이메일을 찾을 수 없습니다.' }, { status: 404 })
  }

  return NextResponse.json({ email: data.email })
}
