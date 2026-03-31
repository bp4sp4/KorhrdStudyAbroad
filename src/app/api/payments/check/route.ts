import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ completed: false })

    const { data } = await supabase
      .from('payments')
      .select('id, program')
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(1)

    return NextResponse.json({ completed: !!data?.length, program: data?.[0]?.program ?? null })
  } catch {
    return NextResponse.json({ completed: false })
  }
}
