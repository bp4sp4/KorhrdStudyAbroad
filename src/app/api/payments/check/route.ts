import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ completed: false })
    }

    // admin 클라이언트로 RLS 우회하여 확인
    const admin = createAdminClient()
    const { data } = await admin
      .from('payments')
      .select('id, program, status, user_id')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5)

    const completed = data?.find(p => p.status === 'completed')
    return NextResponse.json({ completed: !!completed, program: completed?.program ?? null })
  } catch (e) {
    return NextResponse.json({ completed: false })
  }
}
