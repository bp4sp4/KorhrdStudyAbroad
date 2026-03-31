import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// PayApp 매출전표에서 "확인" 클릭 후 이동되는 페이지
// 부모창에 결제완료를 알리고 팝업을 닫는다
const CLOSE_HTML = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>결제 완료</title>
  </head>
  <body>
    <script>
      try { localStorage.setItem('payment_complete', Date.now().toString()) } catch(e) {}
      if (window.opener) {
        try { window.opener.postMessage({ type: 'PAYMENT_COMPLETE' }, '*') } catch(e) {}
      }
      window.close();
    </script>
    <p style="text-align:center;margin-top:40px;font-family:sans-serif;color:#666">결제가 완료되었습니다. 이 창을 닫아주세요.</p>
  </body>
</html>`

const FAIL_HTML = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>결제 실패</title>
  </head>
  <body>
    <script>setTimeout(function(){ window.close() }, 3000)</script>
    <p style="text-align:center;margin-top:40px;font-family:sans-serif;color:#d32f2f">결제가 실패했습니다. 잠시 후 창이 닫힙니다...</p>
  </body>
</html>`

async function handleResult(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const state = searchParams.get('state')
    const tradeid = searchParams.get('tradeid')
    const mul_no = searchParams.get('mul_no')
    const var1 = searchParams.get('var1')
    const csturlFromParams = searchParams.get('csturl') || searchParams.get('CSTURL')

    if (!var1) return new NextResponse(FAIL_HTML, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } })

    const supabase = createAdminClient()

    const { data: payment } = await supabase.from('payments')
      .select('status, csturl')
      .eq('payapp_order_id', var1)
      .single()

    // 실패 처리
    if (state === '0') {
      await supabase.from('payments')
        .update({ status: 'failed', updated_at: new Date().toISOString() })
        .eq('payapp_order_id', var1)
      return new NextResponse(FAIL_HTML, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } })
    }

    // DB 업데이트 (pending인 경우만, 이미 webhook이 completed 처리했을 수도 있음)
    const finalCsturl = csturlFromParams || payment?.csturl || null
    if (payment?.status !== 'completed') {
      await supabase.from('payments')
        .update({
          status: 'completed',
          payapp_tid: tradeid || mul_no || undefined,
          csturl: finalCsturl ?? undefined,
          updated_at: new Date().toISOString(),
        })
        .eq('payapp_order_id', var1)
    }

    // PayApp 매출전표에서 "확인" 누르면 여기로 옴 → 팝업 닫기
    return new NextResponse(CLOSE_HTML, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    })
  } catch (error) {
    console.error('Payment result error:', error)
    return new NextResponse(FAIL_HTML, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } })
  }
}

export async function GET(request: NextRequest) {
  return handleResult(request)
}

export async function POST(request: NextRequest) {
  return handleResult(request)
}
