import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const params = new URLSearchParams(body)

    const state = params.get('state')
    const tradeid = params.get('tradeid')
    const mul_no = params.get('mul_no')
    const var1 = params.get('var1') // orderId
    const price = params.get('price')
    const paymethod = params.get('paymethod')
    const csturl = params.get('csturl') || params.get('CSTURL')

    console.log('PayApp webhook:', { state, tradeid, mul_no, var1, price, paymethod, csturl })

    const supabase = createAdminClient()

    if (state === '1' || (state === null && mul_no)) {
      const { error } = await supabase.from('payments')
        .update({
          status: 'completed',
          payapp_tid: tradeid || mul_no,
          csturl: csturl ?? undefined,
          updated_at: new Date().toISOString(),
        })
        .eq('payapp_order_id', var1)

      if (error) {
        console.error('Webhook DB error:', error)
        return new NextResponse('FAIL', { status: 200, headers: { 'Content-Type': 'text/plain' } })
      }
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
