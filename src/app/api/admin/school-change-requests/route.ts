import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabaseAdmin
      .from('school_change_requests')
      .select(`
        *,
        users:user_id(name, email, class, school)
      `)
      .eq('status', 'pending');

    if (error) throw error;

    return NextResponse.json({ requests: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { request_id, action } = await request.json(); // action: 'approve' or 'reject'

    if (!request_id || !action) {
      return NextResponse.json({ error: 'Missing request_id or action' }, { status: 400 });
    }

    // Get the request
    const { data: req, error: fetchError } = await supabaseAdmin
      .from('school_change_requests')
      .select('*')
      .eq('id', request_id)
      .single();

    if (fetchError || !req) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    if (action === 'approve') {
      // Update user profile
      const { error: updateError } = await supabaseAdmin
        .from('users')
        .update({
          class: req.requested_class,
          school: req.requested_school
        })
        .eq('user_id', req.user_id);

      if (updateError) throw updateError;

      // Update request status
      const { error: statusError } = await supabaseAdmin
        .from('school_change_requests')
        .update({ status: 'approved' })
        .eq('id', request_id);

      if (statusError) throw statusError;

    } else if (action === 'reject') {
      const { error: statusError } = await supabaseAdmin
        .from('school_change_requests')
        .update({ status: 'rejected' })
        .eq('id', request_id);

      if (statusError) throw statusError;
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}