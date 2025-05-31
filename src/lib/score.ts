import { createServerActionClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function getUserScore(userId: string) {
  const supabase = createServerComponentClient({ cookies })
  const { data, error } = await supabase
    .from('scores')
    .select('score')
    .eq('user_id', userId)
    .single()
  if (error && error.code !== 'PGRST116') throw error
  return data?.score ?? 0
}

export async function incrementScore(userId: string, amount: number) {
  const supabase = createServerActionClient({ cookies })
  // Upsert: insert or update
  const { error } = await supabase
    .from('scores')
    .upsert({ user_id: userId, score: amount }, { onConflict: 'user_id', ignoreDuplicates: false })
    .select()
  if (error) throw error
}

export async function addArchivePoints(userId: string) {
  const current = await getUserScore(userId)
  await incrementScore(userId, current + 5)
}

export async function addDeletePoints(userId: string) {
  const current = await getUserScore(userId)
  await incrementScore(userId, current + 3)
} 