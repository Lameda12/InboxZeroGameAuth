import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(req: NextRequest) {
  const supabase = createServerComponentClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ score: 0 })
  const { data, error } = await supabase
    .from('scores')
    .select('score')
    .eq('user_id', user.id)
    .single()
  return NextResponse.json({ score: data?.score ?? 0 })
} 