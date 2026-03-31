'use server'

import { createClient } from '@/lib/supabase/server'

export async function submitConsultation(data: {
  name: string
  phone: string
  region: string
  desired_start: string
  message: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { error } = await supabase
    .from('consultations')
    .insert({
      user_id: user?.id ?? null,
      name: data.name,
      phone: data.phone,
      region: data.region,
      desired_start: data.desired_start,
      message: data.message,
      privacy_agreed: true,
      status: 'pending',
    })

  if (error) throw new Error(error.message)
}
