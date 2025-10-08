import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('schools')
      .select('city,state')
      .order('state', { ascending: true })
      .order('city', { ascending: true })

    if (error) throw error

    const unique = new Map<string, { city: string, state: string }>()
    for (const row of data ?? []) {
      const key = `${row.city}__${row.state}`
      if (row.city && !unique.has(key)) {
        unique.set(key, { city: row.city as string, state: row.state as string })
      }
    }
    return NextResponse.json({ cities: Array.from(unique.values()) })
  } catch (error) {
    console.error('Error fetching cities:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cities' },
      { status: 500 }
    )
  }
}


