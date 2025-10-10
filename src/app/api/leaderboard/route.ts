import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const school_id = searchParams.get('school_id')
    const class_name = searchParams.get('class_name')

    // Get school leaderboard - sum points by school
    let query = supabase
      .from('users')
      .select(`
        points,
        schools!inner(name, city, state)
      `)

    if (school_id) {
      query = query.eq('school_id', parseInt(school_id))
    }

    if (class_name) {
      query = query.eq('class', class_name)
    }

    const { data, error } = await query

    if (error) {
      throw error
    }

    // Group by school and sum points
    const schoolMap = new Map<string, { name: string; points: number; city: string; state: string }>();

    (data || []).forEach(user => {
      if (user.schools && user.schools.length > 0 && user.points) {
        const school = user.schools[0];
        const schoolKey = school.name;
        if (schoolMap.has(schoolKey)) {
          schoolMap.get(schoolKey)!.points += user.points;
        } else {
          schoolMap.set(schoolKey, {
            name: school.name,
            points: user.points,
            city: school.city,
            state: school.state
          });
        }
      }
    });

    // Convert to array and sort by points
    const leaderboard = Array.from(schoolMap.values())
      .sort((a, b) => b.points - a.points)
      .map((school, index) => ({
        rank: index + 1,
        name: school.name,
        points: school.points,
        location: `${school.city}, ${school.state}`
      }));

    return NextResponse.json({ leaderboard })
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    )
  }
}


