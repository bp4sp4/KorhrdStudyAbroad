'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function createAdmin(formData: FormData) {
  const supabase = await createClient()
  const { data: { user: me } } = await supabase.auth.getUser()
  if (!me) redirect('/admin/login')

  const adminClient = createAdminClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('full_name') as string

  const { data, error } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  })

  if (error) {
    redirect(`/admin/users?error=${encodeURIComponent(error.message)}`)
  }

  await adminClient
    .from('profiles')
    .update({ is_admin: true, full_name: fullName, email })
    .eq('id', data.user.id)

  redirect('/admin/users?success=관리자 계정이 생성되었습니다')
}
