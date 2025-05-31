import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  const supabase = createServerComponentClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const { action } = await req.json()
  const points = action === 'archive' ? 5 : action === 'delete' ? 3 : 0
  if (!points) return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

  // Get current score
  const { data, error } = await supabase
    .from('scores')
    .select('score')
    .eq('user_id', user.id)
    .single()
  if (error && error.code !== 'PGRST116') return NextResponse.json({ error: error.message }, { status: 500 })
  const current = data?.score ?? 0

  // Upsert new score
  const { error: upsertError } = await supabase
    .from('scores')
    .upsert({ user_id: user.id, score: current + points }, { onConflict: 'user_id', ignoreDuplicates: false })
  if (upsertError) return NextResponse.json({ error: upsertError.message }, { status: 500 })

  return NextResponse.json({ score: current + points })
} 