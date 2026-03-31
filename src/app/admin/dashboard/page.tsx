import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import DashboardClient from './DashboardClient'

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin, full_name, email')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) redirect('/admin/login?error=관리자 권한이 없습니다')

  // 관리자 전용 조회는 service role로 RLS 우회
  const adminSupabase = createAdminClient()

  const { data: users } = await adminSupabase
    .from('profiles')
    .select('id, full_name, email, target_country, created_at, is_admin')
    .order('created_at', { ascending: false })

  const { data: applications } = await adminSupabase
    .from('applications')
    .select('*')
    .order('created_at', { ascending: false })

  const { data: consultations } = await adminSupabase
    .from('consultations')
    .select('*')
    .order('created_at', { ascending: false })

  const { data: payments } = await adminSupabase
    .from('payments')
    .select('*, profiles(full_name)')
    .order('created_at', { ascending: false })

  return (
    <DashboardClient
      users={users ?? []}
      applications={applications ?? []}
      consultations={consultations ?? []}
      payments={payments ?? []}
      adminEmail={profile.email ?? ''}
    />
  )
}
