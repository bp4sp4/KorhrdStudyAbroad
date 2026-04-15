import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function DELETE() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: '인증되지 않은 사용자입니다.' }, { status: 401 })
  }

  const admin = createAdminClient()

  const { error } = await admin.auth.admin.deleteUser(user.id)

  if (error) {
    console.error('delete user error:', error)
    return NextResponse.json({ error: '탈퇴 처리에 실패했습니다.' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
