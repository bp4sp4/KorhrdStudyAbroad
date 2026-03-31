import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

function buildSuccessHtml(csturl: string | null) {
  const receiptBtn = csturl
    ? `<a href="${csturl}" target="_blank" class="btn btn_receipt">영수증 보기</a>`
    : ''

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>결제 완료</title>
    <style>
      *{margin:0;padding:0;box-sizing:border-box}
      body{font-family:-apple-system,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;background:linear-gradient(135deg,#4C85FF 0%,#0051FF 100%);padding:20px}
      .card{text-align:center;background:#fff;padding:48px 40px 36px;border-radius:20px;box-shadow:0 20px 60px rgba(0,0,0,.3);max-width:380px;width:100%}
      .icon{width:72px;height:72px;margin:0 auto 20px;background:#e8efff;border-radius:50%;display:flex;align-items:center;justify-content:center}
      h1{color:#010101;margin:0 0 8px;font-size:22px;font-weight:700}
      p{color:#919191;margin:0 0 28px;font-size:14px}
      .btns{display:flex;flex-direction:column;gap:10px}
      .btn{display:block;padding:14px;border-radius:10px;font-size:15px;font-weight:700;border:none;cursor:pointer;width:100%;text-decoration:none;text-align:center}
      .btn_receipt{background:#f0f4ff;color:#0051FF}
      .btn_close{background:#0051FF;color:#fff}
    </style>
  </head>
  <body>
    <div class="card">
      <div class="icon">
        <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
          <path d="M8 20L16 28L32 12" stroke="#0051FF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h1>결제가 완료되었습니다!</h1>
      <p>영수증을 확인 후 창을 닫아주세요</p>
      <div class="btns">
        ${receiptBtn}
        <button class="btn btn_close" onclick="if(window.opener){window.opener.postMessage({type:'PAYMENT_COMPLETE'},'*');} window.close();">닫기</button>
      </div>
    </div>
  </body>
</html>`
}

const FAIL_HTML = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>결제 실패</title>
    <style>
      *{margin:0;padding:0;box-sizing:border-box}
      body{font-family:-apple-system,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;background:#f5f5f5;padding:20px}
      .card{text-align:center;background:#fff;padding:40px;border-radius:12px;max-width:400px;width:100%}
      h1{color:#d32f2f;margin:0 0 10px;font-size:20px}
      p{color:#666;font-size:14px}
    </style>
  </head>
  <body>
    <div class="card">
      <h1>결제가 실패했습니다</h1>
      <p>잠시 후 창이 자동으로 닫힙니다...</p>
    </div>
    <script>setTimeout(function(){window.close()},3000)</script>
  </body>
</html>`

export async function GET(request: NextRequest) {
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

    // 항상 영수증 표시 (부모창 모달은 폴링으로 처리)
    return new NextResponse(buildSuccessHtml(finalCsturl), {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    })
  } catch (error) {
    console.error('Payment result error:', error)
    return new NextResponse(FAIL_HTML, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } })
  }
}

export async function POST(request: NextRequest) {
  return GET(request)
}
