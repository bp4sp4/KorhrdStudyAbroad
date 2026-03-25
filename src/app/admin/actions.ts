'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function adminLogin(formData: FormData) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  })

  if (error || !data.user) {
    redirect(`/admin/login?error=${encodeURIComponent(error?.message ?? '로그인 실패')}`)
  }

  // 로그인 후 세션 있으므로 일반 클라이언트로 조회 (RLS 허용: auth.uid() = id)
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', data.user.id)
    .single()

  if (!profile?.is_admin) {
    await supabase.auth.signOut()
    redirect('/admin/login?error=관리자 권한이 없습니다')
  }

  revalidatePath('/', 'layout')
  redirect('/admin/dashboard')
}

export async function adminLogout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/admin/login')
}
