import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendVerificationSMS } from '@/lib/sms'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phone } = body

    if (!phone) {
      return NextResponse.json(
        { error: '전화번호를 입력해주세요.' },
        { status: 400 }
      )
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000)

    const supabase = createAdminClient()
    const { error: dbError } = await supabase
      .from('phone_verifications')
      .insert({
        phone,
        code,
        expires_at: expiresAt.toISOString(),
        verified: false,
      })

    if (dbError) {
      console.error('DB 저장 오류:', dbError)
      return NextResponse.json(
        { error: '인증번호 저장에 실패했습니다.' },
        { status: 500 }
      )
    }

    const smsSent = await sendVerificationSMS(phone, code)

    if (!smsSent) {
      console.error('SMS 발송 실패')
      if (process.env.NODE_ENV !== 'development') {
        return NextResponse.json(
          { error: 'SMS 발송에 실패했습니다.' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({
      success: true,
      message: '인증번호가 발송되었습니다.',
      ...(process.env.NODE_ENV === 'development' && { code }),
    })
  } catch (error) {
    console.error('Send verification error:', error)
    return NextResponse.json(
      { error: '인증번호 발송 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
