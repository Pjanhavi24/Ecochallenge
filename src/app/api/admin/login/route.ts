import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    const expected = process.env.ADMIN_PASSWORD || 'admin123'

    if (!password || password !== expected) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const res = NextResponse.json({ ok: true })
    res.cookies.set('admin', '1', { httpOnly: true, path: '/', maxAge: 60 * 60 * 8 })
    return res
  } catch (e) {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }
}


