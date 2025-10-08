import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET() {
  try {
    // Test database connection by fetching schools
    const { data: schools, error } = await supabase
      .from('schools')
      .select('id, name, city, state')
      .limit(10)

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      schoolsCount: schools?.length || 0,
      schools: schools || [],
    })
  } catch (error) {
    console.error('Database test error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Database connection failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}


