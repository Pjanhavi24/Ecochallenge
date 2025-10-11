import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, challenge_id, assignment_id, description, image_url, file_url } = body

    if (!user_id || !challenge_id) {
      return NextResponse.json(
        { error: 'User ID and Challenge ID are required' },
        { status: 400 }
      )
    }

    const payload: any = {
      user_id,
      challenge_id,
      description,
      image_url,
      file_url,
    }
    if (assignment_id) {
      payload.assignment_id = assignment_id
    }

    const { data, error } = await supabaseAdmin.from('submissions').insert([payload]).select('*').single()
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ submission: data })
  } catch (error) {
    console.error('Error creating submission:', error)
    return NextResponse.json(
      { error: 'Failed to create submission' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { submission_id, status, reviewed_by, notes } = body

    if (!submission_id || !status) {
      return NextResponse.json(
        { error: 'Submission ID and status are required' },
        { status: 400 }
      )
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(submission_id)) {
      return NextResponse.json(
        { error: 'Invalid submission ID format' },
        { status: 400 }
      )
    }

    const updateData: any = {
      status,
      reviewed_by: reviewed_by,
      updated_at: new Date().toISOString()
    }
    if (notes !== undefined) {
      updateData.notes = notes
    }

    // First, get the current submission to check if status is changing to approved
    const { data: currentSubmission, error: fetchError } = await supabaseAdmin
      .from('submissions')
      .select('user_id, challenge_id, status')
      .eq('submission_id', submission_id)
      .single()

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }

    const wasPending = currentSubmission.status === 'pending'
    const isApproving = status === 'approved'

    const { data, error } = await supabaseAdmin
      .from('submissions')
      .update(updateData)
      .eq('submission_id', submission_id)
      .select('*')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // If approving a previously pending submission, add points
    if (wasPending && isApproving) {
      // Get challenge points
      const { data: challenge, error: challengeError } = await supabaseAdmin
        .from('challenges')
        .select('points')
        .eq('challenge_id', currentSubmission.challenge_id)
        .single()

      if (!challengeError && challenge) {
        // Get current user points
        const { data: user, error: userError } = await supabaseAdmin
          .from('users')
          .select('points')
          .eq('user_id', currentSubmission.user_id)
          .single()

        if (!userError && user) {
          const newPoints = (user.points || 0) + challenge.points
          // Update points
          const { error: pointsError } = await supabaseAdmin
            .from('users')
            .update({ points: newPoints })
            .eq('user_id', currentSubmission.user_id)

          if (pointsError) {
            console.error('Error updating points:', pointsError)
            // Don't fail the request, just log
          }
        }
      }
    }

    return NextResponse.json({ submission: data })
  } catch (error) {
    console.error('Error updating submission:', error)
    return NextResponse.json(
      { error: 'Failed to update submission' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // For now, allow access to all submissions (since we're using service role)
    // In production, you'd check user authentication and role

    // Get teacher's school - for now, we'll show all submissions
    // In a real app, you'd filter by the authenticated teacher's school
    let schoolFilter = null

    let query = supabaseAdmin
      .from('submissions')
      .select(`
        submission_id,
        user_id,
        challenge_id,
        description,
        image_url,
        file_url,
        status,
        reviewed_by,
        notes,
        ai_analysis,
        challenge:challenges(title),
        users!user_id(name, school)
      `)

    // If teacher has a school, filter submissions to only students from that school
    if (schoolFilter) {
      query = query.eq('users.school', schoolFilter)
    }

    const { data, error } = await query

    if (error) {
      console.error('Database error:', error)
      // If table doesn't exist or other database error, return empty array
      if (error.code === 'PGRST116' || error.message.includes('relation "submissions" does not exist')) {
        return NextResponse.json({ submissions: [] })
      }
      return NextResponse.json({ error: error.message, code: error.code }, { status: 500 })
    }

    return NextResponse.json({ submissions: data || [] })
  } catch (error) {
    console.error('Error fetching submissions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch submissions', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
