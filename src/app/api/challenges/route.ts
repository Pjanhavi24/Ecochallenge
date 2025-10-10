import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET() {
  try {
    const { data: challenges, error } = await supabaseAdmin
      .from('challenges')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ challenges })
  } catch (error) {
    console.error('Error fetching challenges:', error)
    return NextResponse.json(
      { error: 'Failed to fetch challenges' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/challenges called')
    console.log('SUPABASE_SERVICE_ROLE_KEY exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY)
    const body = await request.json()
    const { title, description, category, points, imageId, tutorialUrl } = body
    console.log('Request body:', body)

    if (!title || !description || !category || !points) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const insertData: any = {
      title,
      description,
      category,
      points: parseInt(points),
      image_id: imageId || 'task-1-tree', // Default placeholder image
    }

    if (tutorialUrl) insertData.tutorial_url = tutorialUrl

    console.log('Insert data:', insertData)

    const { data: challenge, error } = await supabaseAdmin
      .from('challenges')
      .insert([insertData])
      .select()
      .single()

    console.log('Supabase response:', { data: challenge, error })

    if (error) {
      console.error('Database insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('Challenge created successfully:', challenge)
    return NextResponse.json({ challenge })
  } catch (error) {
    console.error('Error creating challenge:', error)
    return NextResponse.json(
      { error: 'Failed to create challenge' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { challenge_id, title, description, category, points, imageId, tutorialUrl } = body

    if (!challenge_id || !title || !description || !category || !points) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const updateData: any = {
      title,
      description,
      category,
      points: parseInt(points),
    }

    if (imageId !== undefined) updateData.image_id = imageId
    if (tutorialUrl !== undefined) updateData.tutorial_url = tutorialUrl

    const { data: challenge, error } = await supabaseAdmin
      .from('challenges')
      .update(updateData)
      .eq('challenge_id', challenge_id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ challenge })
  } catch (error) {
    console.error('Error updating challenge:', error)
    return NextResponse.json(
      { error: 'Failed to update challenge' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const challenge_id = searchParams.get('challenge_id')

    if (!challenge_id) {
      return NextResponse.json(
        { error: 'Challenge ID is required' },
        { status: 400 }
      )
    }

    const { error } = await supabaseAdmin
      .from('challenges')
      .delete()
      .eq('challenge_id', challenge_id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting challenge:', error)
    return NextResponse.json(
      { error: 'Failed to delete challenge' },
      { status: 500 }
    )
  }
}


