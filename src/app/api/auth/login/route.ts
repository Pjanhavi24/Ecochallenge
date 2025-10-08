import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { users } from '@/lib/data';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const role = body.role === 'teacher' ? 'teacher' : 'student';

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Demo auth: find by email and role only; ignore password
    const user = users.find(u => u.email.toLowerCase() === email && u.role === role);
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const cookieStore = await cookies();
    cookieStore.set('sessionUser', JSON.stringify({ id: user.id, role: user.role }), {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
    });

    const redirectTo = user.role === 'teacher' ? '/teacher' : '/student';
    return NextResponse.json({ ok: true, redirectTo });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}



