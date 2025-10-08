import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { teacher_id, challenge_id, school_id, class_name, due_date } = body

    if (!teacher_id || !challenge_id) {
      return NextResponse.json(
        { error: 'Teacher ID and Challenge ID are required' },
        { status: 400 }
      )
    }

    const insertData: any = {
      teacher_id: parseInt(teacher_id),
      challenge_id: parseInt(challenge_id),
    }

    if (school_id) insertData.school_id = parseInt(school_id)
    if (class_name) insertData.class_name = class_name
    if (due_date) insertData.due_date = due_date

    const { data, error } = await supabaseAdmin
      .from('teacher_assignments')
      .insert([insertData])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ assignment: data })
  } catch (error) {
    console.error('Error creating assignment:', error)
    return NextResponse.json(
      { error: 'Failed to create assignment' },
      { status: 500 }
    )
  }
}


