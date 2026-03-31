import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const params = new URLSearchParams(body)

    // PayApp 실제 파라미터명: pay_state, payauthcode, pay_type
    const payState = params.get('pay_state')
    const mul_no = params.get('mul_no')
    const var1 = params.get('var1')
    const price = params.get('price')
    const payauthcode = params.get('payauthcode')
    const payType = params.get('pay_type')
    const csturl = params.get('csturl') || params.get('CSTURL')

    console.log('PayApp webhook:', { pay_state: payState, mul_no, var1, price, payauthcode, payType, csturl })

    const supabase = createAdminClient()

    // pay_state: 4 = 결제완료, 8 = 결제취소
    if (payState === '4') {
      const { error } = await supabase.from('payments')
        .update({
          status: 'completed',
          payapp_tid: mul_no,
          csturl: csturl ?? undefined,
          updated_at: new Date().toISOString(),
        })
        .eq('payapp_order_id', var1)

      if (error) {
        console.error('Webhook DB error:', error)
        return new NextResponse('FAIL', { status: 200, headers: { 'Content-Type': 'text/plain' } })
      }
    } else if (payState === '8') {
      await supabase.from('payments')
        .update({ status: 'cancelled', updated_at: new Date().toISOString() })
        .eq('payapp_order_id', var1)
    } else {
      await supabase.from('payments')
        .update({ status: 'failed', updated_at: new Date().toISOString() })
        .eq('payapp_order_id', var1)
    }

    // PayApp은 반드시 "SUCCESS" 응답 필요
    return new NextResponse('SUCCESS', { status: 200, headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
  } catch (error) {
    console.error('Webhook error:', error)
    return new NextResponse('FAIL', { status: 200, headers: { 'Content-Type': 'text/plain' } })
  }
}
