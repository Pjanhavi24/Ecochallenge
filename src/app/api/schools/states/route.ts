import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('schools')
      .select('state')
      .order('state', { ascending: true })

    if (error) throw error
    const unique = Array.from(new Set((data ?? []).map(r => r.state).filter(Boolean)))
    return NextResponse.json({ states: unique })
  } catch (error) {
    console.error('Error fetching states:', error)
    return NextResponse.json(
      { error: 'Failed to fetch states' },
      { status: 500 }
    )
  }
}


