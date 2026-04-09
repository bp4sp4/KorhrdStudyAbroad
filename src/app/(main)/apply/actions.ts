'use server'

import { createClient } from '@/lib/supabase/server'

export async function createPaymentRecord(program: string, amount: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('로그인이 필요합니다.')

  const orderId = `HPS-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

  const { error } = await supabase.from('payments').insert({
    user_id: user.id,
    program,
    amount,
    payapp_order_id: orderId,
    status: 'pending',
    method: 'payapp',
  })

  if (error) throw new Error('결제 정보 생성 실패')

  return orderId
}

/** 계좌이체 신청 — 결제대기 상태로 기록, 어드민 확인 후 수동 completed 처리 */
export async function createBankTransferRequest(program: string, amount: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('로그인이 필요합니다.')

  const orderId = `BANK-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

  const { error } = await supabase.from('payments').insert({
    user_id: user.id,
    program,
    amount,
    payapp_order_id: orderId,
    status: 'pending',
    method: 'bank_transfer',
  })

  if (error) throw new Error('계좌이체 신청 실패')

  return orderId
}

export async function checkAnyCompletedPayment() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('payments')
    .select('id, program, amount, status, payapp_order_id, payapp_tid, created_at')
    .eq('user_id', user.id)
    .eq('status', 'completed')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  return data ?? null
}
