import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const school_id = searchParams.get('school_id')
    const class_name = searchParams.get('class_name')
    const type = searchParams.get('type') // 'school' or 'students'


    if (type === 'students') {
      // Get current user's school first
      const { data: sessionData } = await supabase.auth.getSession()
      let userSchool = null
      if (sessionData?.session?.user) {
        const { data: userData } = await supabaseAdmin
          .from("users")
          .select("school")
          .eq("user_id", sessionData.session.user.id)
          .single();
        userSchool = userData?.school
      }

      // For debugging, return all students
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('name, points, class, school')
        .ilike('role', 'student')
        .order('points', { ascending: false })

      if (error) {
        throw error
      }

      const studentLeaderboard = (data || [])
        .filter(student => student.points > 0)
        .map((student, index) => ({
          rank: index + 1,
          name: student.name,
          points: student.points,
          class: student.class
        }));

      return NextResponse.json({ leaderboard: studentLeaderboard })
    } else if (type === 'all_students') {
      // Get all students from all schools
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('name, points, class, school, profile_image_url')
        .ilike('role', 'student')
        .order('points', { ascending: false })

      if (error) {
        throw error
      }

      const allStudentsLeaderboard = (data || [])
        .filter(student => student.points > 0)
        .map((student, index) => ({
          rank: index + 1,
          name: student.name,
          points: student.points,
          class: student.class,
          school: student.school || 'Unknown',
          profile_image_url: student.profile_image_url
        }));

      return NextResponse.json({ leaderboard: allStudentsLeaderboard })
    } else {
      // Get school leaderboard - sum points by school (default behavior)
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('school, points')
        .ilike('role', 'student')

      if (error) {
        throw error
      }

      // Group by school and sum points
      const schoolMap = new Map<string, { name: string; points: number; city: string; state: string }>();

      (data || []).forEach(user => {
        if (user.school && user.points) {
          const schoolKey = user.school;
          if (schoolMap.has(schoolKey)) {
            schoolMap.get(schoolKey)!.points += user.points;
          } else {
            // For now, set city/state as unknown, or we can fetch schools separately
            schoolMap.set(schoolKey, {
              name: schoolKey,
              points: user.points,
              city: 'Unknown',
              state: 'Unknown'
            });
          }
        }
      });

      // Optionally, fetch school details
      const schoolNames = Array.from(schoolMap.keys());
      if (schoolNames.length > 0) {
        const { data: schoolsData, error: schoolsError } = await supabaseAdmin
          .from('schools')
          .select('name, city, state')
          .in('name', schoolNames);

        if (!schoolsError && schoolsData) {
          schoolsData.forEach(school => {
            if (schoolMap.has(school.name)) {
              schoolMap.get(school.name)!.city = school.city;
              schoolMap.get(school.name)!.state = school.state;
            }
          });
        }
      }

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
    }
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    )
  }
}


