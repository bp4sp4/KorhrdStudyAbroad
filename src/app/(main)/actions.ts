'use server'

import { createClient } from '@/lib/supabase/server'

export async function submitConsultation(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const name          = formData.get('name') as string
  const phone         = formData.get('phone') as string
  const region        = formData.get('region') as string
  const desired_start = formData.get('desired_start') as string
  const message       = formData.get('message') as string
  const privacy_agreed = formData.get('privacy_agreed') === 'on'
  const type          = (formData.get('type') as string) || 'consult'

  if (!name || !phone || !region || !desired_start || !message) {
    return { error: '모든 항목을 입력해주세요.' }
  }
  if (!privacy_agreed) {
    return { error: '개인정보처리방침에 동의해주세요.' }
  }

  const { error } = await supabase.from('consultations').insert({
    user_id: user?.id ?? null,   // 비회원이면 null
    name,
    phone,
    region,
    desired_start,
    message,
    privacy_agreed,
    type,
  })

  if (error) return { error: '신청 중 오류가 발생했습니다.' }
  return { success: true }
}
