import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get('city') ?? undefined
    const state = searchParams.get('state') ?? undefined
    const search = searchParams.get('search') ?? undefined
    const limitParam = searchParams.get('limit')
    const limit = limitParam ? parseInt(limitParam, 10) : undefined

    let query = supabaseAdmin
      .from('schools')
      .select('*')

    if (city) {
      query = query.ilike('city', `%${city}%`)
    }
    if (state) {
      query = query.ilike('state', `%${state}%`)
    }
    if (search) {
      // name OR city OR state match
      query = query.or(
        `name.ilike.%${search}%,city.ilike.%${search}%,state.ilike.%${search}%`
      )
    }
    if (limit) {
      query = query.limit(limit)
    }
    query = query.order('state', { ascending: true }).order('city', { ascending: true }).order('name', { ascending: true })

    const { data, error } = await query
    if (error) {
      throw error
    }

    return NextResponse.json({
      schools: data ?? [],
      total: data?.length ?? 0,
      filters: { city, state, search, limit },
    })
  } catch (error) {
    console.error('Error fetching schools:', error)
    return NextResponse.json(
      { error: 'Failed to fetch schools' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const adminCookie = request.cookies.get('admin')?.value
    if (adminCookie !== '1') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, address, city, state, country } = body || {}

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('schools')
      .insert([
        {
          name,
          address: address ?? null,
          city: city ?? null,
          state: state ?? null,
          country: country ?? 'India',
        },
      ])
      .select('*')
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({ school: data })
  } catch (error) {
    console.error('Error creating school:', error)
    return NextResponse.json(
      { error: 'Failed to create school' },
      { status: 500 }
    )
  }
}


