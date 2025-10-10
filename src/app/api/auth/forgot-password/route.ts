import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import crypto from 'crypto'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    // Check if service role key is available
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: 'Server configuration error: Missing service role key' },
        { status: 500 }
      )
    }

    // Dynamically import supabaseAdmin to handle missing env vars gracefully
    const { supabaseAdmin } = await import('@/lib/supabaseAdmin')

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

    // Check if user exists in our database
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('user_id, email, name, role')
      .eq('email', email.toLowerCase())
      .eq('role', role)
      .maybeSingle()

    if (userError) {
      console.error('Database error:', userError)
      return NextResponse.json(
        { error: 'Database error occurred' },
        { status: 500 }
      )
    }

    if (!user) {
      // Return success even if user doesn't exist for security
      return NextResponse.json(
        { message: 'If an account with that email exists, a password reset link has been sent.' },
        { status: 200 }
      )
    }

    // Generate a secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now

    // Store the reset token in the database
    const { error: tokenError } = await supabaseAdmin
      .from('password_reset_tokens')
      .insert({
        token: resetToken,
        user_id: user.user_id,
        email: user.email,
        expires_at: expiresAt.toISOString(),
        used: false
      })

    if (tokenError) {
      console.error('Token storage error:', tokenError)
      return NextResponse.json(
        { error: 'Failed to generate reset token' },
        { status: 500 }
      )
    }

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}&role=${role}`

    // Send email with reset link using nodemailer
    console.log('📧 EMAIL_USER:', process.env.EMAIL_USER ? 'Set' : 'Not set')
    console.log('📧 EMAIL_PASS:', process.env.EMAIL_PASS ? 'Set' : 'Not set')

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      console.log('📧 Attempting to send email to:', user.email)

      try {
        // Create transporter with Gmail
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        })

        // Verify connection
        await transporter.verify()
        console.log('📧 Gmail connection verified')

        // Send email
        const info = await transporter.sendMail({
          from: `"Eco Challenge" <${process.env.EMAIL_USER}>`,
          to: user.email,
          subject: 'Reset Your Password - Eco Challenge',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #16a34a; text-align: center;">Reset Your Password</h2>
              <p>Hello ${user.name},</p>
              <p>You requested a password reset for your Eco Challenge account.</p>
              <p>Click the button below to reset your password:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}"
                   style="background-color: #16a34a; color: white; padding: 12px 24px;
                          text-decoration: none; border-radius: 6px; display: inline-block;
                          font-weight: bold;">
                  Reset Password
                </a>
              </div>
              <p><strong>This link will expire in 24 hours.</strong></p>
              <p>If you didn't request this reset, please ignore this email.</p>
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
              <p style="color: #666; font-size: 12px;">
                Best regards,<br>
                The Eco Challenge Team
              </p>
            </div>
          `
        })

        console.log('✅ Email sent successfully!')
        console.log('📧 Message ID:', info.messageId)

      } catch (error) {
        console.error('❌ Email sending failed:', error)
        if (error instanceof Error) {
          console.error('📧 Error message:', error.message)
          if (error.message.includes('535')) {
            console.error('📧 Gmail authentication failed - check EMAIL_USER and EMAIL_PASS')
          } else if (error.message.includes('454')) {
            console.error('📧 Gmail blocked the sign-in - check Gmail security settings')
          }
        }
      }
    } else {
      console.log('⚠️  Email credentials not configured')
      console.log('🔗 Reset URL for manual use:', resetUrl)
    }

    return NextResponse.json(
      {
        message: 'If an account with that email exists, a password reset link has been sent.',
        // Always show reset URL for testing when email fails
        resetUrl: resetUrl,
        emailSent: !!(process.env.EMAIL_USER && process.env.EMAIL_PASS)
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
