import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

function buildSuccessHtml(csturl: string | null) {
  if (csturl) {
    // 부모창에 결제완료 메시지 전송 후 PayApp 영수증으로 이동
    return `<!DOCTYPE html>
<html>
  <head><meta charset="UTF-8"><title>결제 완료</title></head>
  <body>
    <script>
      if (window.opener) {
        window.opener.postMessage({ type: 'PAYMENT_COMPLETE' }, '*');
      }
      window.location.href = '${csturl}';
    </script>
  </body>
</html>`
  }

  // CSTURL 없을 때 fallback — 버튼 클릭 시 메시지 전송 후 닫기
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
      .btn{display:block;padding:14px;border-radius:10px;background:#0051FF;color:#fff;font-size:15px;font-weight:700;border:none;cursor:pointer;width:100%}
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
      <p>창을 닫고 신청서를 작성해 주세요</p>
      <button class="btn" onclick="if(window.opener){window.opener.postMessage({type:'PAYMENT_COMPLETE'},'*');} window.close();">확인</button>
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
    // 모든 파라미터 로그 (PayApp이 어떤 값을 보내는지 확인용)
    const allParams: Record<string, string> = {}
    searchParams.forEach((v, k) => { allParams[k] = v })
    console.log('[result] GET params:', allParams)

    const state = searchParams.get('state')
    const tradeid = searchParams.get('tradeid')
    const mul_no = searchParams.get('mul_no')
    const var1 = searchParams.get('var1') // orderId
    // PayApp이 returnurl 파라미터로 csturl을 전달하는 경우
    const csturlFromParams = searchParams.get('csturl') || searchParams.get('CSTURL')

    const supabase = createAdminClient()

    if (state === '1' || (state === null && mul_no)) {
      // DB에서 기존 csturl 조회 (webhook에서 먼저 저장됐을 수 있음)
      const { data: payment } = await supabase.from('payments')
        .select('csturl')
        .eq('payapp_order_id', var1)
        .single()

      const finalCsturl = csturlFromParams || payment?.csturl || null

      await supabase.from('payments')
        .update({
          status: 'completed',
          payapp_tid: tradeid || mul_no,
          csturl: finalCsturl ?? undefined,
          updated_at: new Date().toISOString(),
        })
        .eq('payapp_order_id', var1)

      return new NextResponse(buildSuccessHtml(finalCsturl), {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      })
    } else if (state === '0') {
      await supabase.from('payments')
        .update({ status: 'failed', updated_at: new Date().toISOString() })
        .eq('payapp_order_id', var1)

      return new NextResponse(FAIL_HTML, {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      })
    } else {
      const { data: payment } = var1 ? await supabase.from('payments')
        .select('csturl')
        .eq('payapp_order_id', var1)
        .single() : { data: null }

      const finalCsturl = csturlFromParams || payment?.csturl || null

      if (var1) {
        await supabase.from('payments')
          .update({ status: 'completed', csturl: finalCsturl ?? undefined, updated_at: new Date().toISOString() })
          .eq('payapp_order_id', var1)
      }
      return new NextResponse(buildSuccessHtml(finalCsturl), {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      })
    }
  } catch (error) {
    console.error('Payment result error:', error)
    return new NextResponse(FAIL_HTML, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    })
  }
}

export async function POST(request: NextRequest) {
  return GET(request)
}
