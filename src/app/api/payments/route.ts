import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, goodname, price, recvphone, var1 } = body

    if (!goodname || !price || !recvphone) {
      return NextResponse.json({ error: '필수 파라미터 누락' }, { status: 400 })
    }

    const payappUserId = process.env.NEXT_PUBLIC_PAYAPP_USER_ID!
    const payappShopName = process.env.NEXT_PUBLIC_PAYAPP_SHOP_NAME!
    const payappLinkKey = process.env.PAYAPP_LINK_KEY!
    let baseUrl = process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
    baseUrl = baseUrl.replace(/\/$/, '')

    const paymentParams = new URLSearchParams({
      cmd: 'payrequest',
      userid: payappUserId,
      linkkey: payappLinkKey,
      shopname: payappShopName,
      goodname: goodname,
      price: price.toString(),
      recvphone: recvphone,
      memo: '',
      feedbackurl: `${baseUrl}/api/payments/webhook`,
      returnurl: `${baseUrl}/api/payments/result?var1=${encodeURIComponent(var1)}`,
      var1: var1,
      smsuse: 'n',
      openpaytype: 'card,phone,kakaopay,naverpay,smilepay,applepay,rbank,vbank,payco,wechat,myaccount',
      amount_taxable: '0',
      amount_taxfree: price.toString(),
      amount_vat: '0',
    })

    const paymentResponse = await fetch('https://api.payapp.kr/oapi/apiLoad.html', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: paymentParams.toString(),
    })

    const responseText = await paymentResponse.text()
    const responseParams = new URLSearchParams(responseText)
    const state = responseParams.get('state')
    const payurl = responseParams.get('payurl')
    const mulNo = responseParams.get('mul_no')
    const csturl = responseParams.get('CSTURL') || responseParams.get('csturl')
    const errorMessage = responseParams.get('errorMessage')

    if (state === '1' && payurl) {
      // mulNo, csturl을 payments 테이블에 저장
      const supabase = await createClient()
      await supabase.from('payments')
        .update({ payapp_tid: mulNo, csturl: csturl ?? null, updated_at: new Date().toISOString() })
        .eq('payapp_order_id', orderId)

      return NextResponse.json({
        success: true,
        data: { payurl, mulNo, var1 }
      })
    } else {
      return NextResponse.json({ error: errorMessage || '결제 요청 실패' }, { status: 400 })
    }
  } catch (error) {
    console.error('Payment request error:', error)
    return NextResponse.json({ error: '결제 요청 중 오류가 발생했습니다.' }, { status: 500 })
  }
}
