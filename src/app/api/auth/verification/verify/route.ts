import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

const MAX_ATTEMPTS = 5

export async function POST(request: NextRequest) {
  try {
    const { phone, code } = await request.json()

    if (!phone || !code) {
      return NextResponse.json({ error: '전화번호와 인증번호를 입력해주세요.' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // 최신 미인증 코드 조회
    const { data: verification, error: dbError } = await supabase
      .from('phone_verifications')
      .select('*')
      .eq('phone', phone)
      .eq('verified', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (dbError || !verification) {
      return NextResponse.json({ error: '유효하지 않거나 만료된 인증번호입니다.' }, { status: 400 })
    }

    // 시도 횟수 초과
    if (verification.attempts >= MAX_ATTEMPTS) {
      await supabase.from('phone_verifications').update({ verified: true }).eq('id', verification.id)
      return NextResponse.json({ error: '인증 시도 횟수를 초과했습니다. 인증번호를 다시 요청해 주세요.' }, { status: 400 })
    }

    // 코드 불일치 → attempts 증가
    if (verification.code !== code) {
      await supabase
        .from('phone_verifications')
        .update({ attempts: verification.attempts + 1 })
        .eq('id', verification.id)
      const remaining = MAX_ATTEMPTS - (verification.attempts + 1)
      return NextResponse.json(
        { error: `인증번호가 올바르지 않습니다. (남은 시도: ${remaining}회)` },
        { status: 400 }
      )
    }

    // 인증 성공
    await supabase.from('phone_verifications').update({ verified: true }).eq('id', verification.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Verify code error:', error)
    return NextResponse.json({ error: '인증번호 확인 중 오류가 발생했습니다.' }, { status: 500 })
  }
}
