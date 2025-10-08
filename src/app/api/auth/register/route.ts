import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, role, school_id, class_name, subject, experience } = body

    // Validate required fields
    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate role
    if (!['STUDENT', 'TEACHER'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be STUDENT or TEACHER' },
        { status: 400 }
      )
    }

    // For students, school_id and class_name are required
    if (role === 'STUDENT' && (!school_id || !class_name)) {
      return NextResponse.json(
        { error: 'Students must provide school_id and class_name' },
        { status: 400 }
      )
    }

    // For teachers, school_id is required
    if (role === 'TEACHER' && !school_id) {
      return NextResponse.json(
        { error: 'Teachers must provide school_id' },
        { status: 400 }
      )
    }

    // Here you would typically:
    // 1. Create user in Supabase Auth
    // 2. Get the auth user ID
    // 3. Create user in your database
    
    // For now, we'll simulate this with a mock user ID
    const mockUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Create user in database
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .insert([{
        id: mockUserId,
        email,
        name,
        role,
        school_id: school_id ? parseInt(school_id) : undefined,
        class: class_name,
        points: 0,
      }])
      .select()
      .single()

    if (userError) {
      throw userError
    }

    let teacherProfile = null

    // If teacher, create teacher profile
    if (role === 'TEACHER') {
      const { data: teacher, error: teacherError } = await supabaseAdmin
        .from('teachers')
        .insert([{
          user_id: mockUserId,
          subject,
          experience: experience ? parseInt(experience) : undefined,
          school_id: school_id ? parseInt(school_id) : undefined,
        }])
        .select()
        .single()

      if (teacherError) {
        throw teacherError
      }

      teacherProfile = teacher
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        school_id: user.school_id,
        class: user.class,
        points: user.points,
      },
      teacherProfile: teacherProfile ? {
        id: teacherProfile.id,
        subject: teacherProfile.subject,
        experience: teacherProfile.experience,
        school_id: teacherProfile.school_id,
      } : null,
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    )
  }
}



