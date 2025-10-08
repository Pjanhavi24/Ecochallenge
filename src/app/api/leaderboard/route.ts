import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const school_id = searchParams.get('school_id')
    const class_name = searchParams.get('class_name')

    // Get users with approved submissions and their total points
    let query = supabase
      .from('users')
      .select(`
        id,
        name,
        points,
        school:schools(name, city, state),
        submissions!inner(
          challenge:challenges(title),
          status
        )
      `)
      .eq('submissions.status', 'APPROVED')

    if (school_id) {
      query = query.eq('school_id', parseInt(school_id))
    }

    if (class_name) {
      query = query.eq('class', class_name)
    }

    query = query.order('points', { ascending: false })

    const { data, error } = await query

    if (error) {
      throw error
    }

    // Process the data to match the expected format
    const leaderboard = (data || []).map(user => ({
      id: user.id,
      name: user.name,
      points: user.points,
      school: user.school,
      submissions: user.submissions
    }))

    return NextResponse.json({ leaderboard })
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    )
  }
}


