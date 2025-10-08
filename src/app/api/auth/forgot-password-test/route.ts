import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, role } = body

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Validate role
    if (!role || !['student', 'teacher'].includes(role)) {
      return NextResponse.json(
        { error: 'Valid role (student or teacher) is required' },
        { status: 400 }
      )
    }

    // For now, just return a success message without database operations
    // This will help us test if the API route is working
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}&role=${role}`

    return NextResponse.json({
      message: 'Password reset request received (test mode)',
      email: email,
      role: role,
      resetUrl: resetUrl,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
