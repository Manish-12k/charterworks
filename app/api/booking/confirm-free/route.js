import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { notifyBookingConfirmed } from '../../razorpay/verify/route';

export async function POST(request) {
  try {
    const { bookingId } = await request.json();
    if (!bookingId) return NextResponse.json({ error: 'Missing bookingId' }, { status: 400 });

    const supabase = createAdminClient();
    const { data: booking, error } = await supabase
      .from('bookings')
      .update({ status: 'confirmed' })
      .eq('id', bookingId)
      .eq('amount_paise', 0) // safety: this endpoint only confirms free bookings
      .select()
      .single();

    if (error || !booking) {
      return NextResponse.json({ error: 'Could not confirm booking' }, { status: 500 });
    }

    await notifyBookingConfirmed(booking);
    return NextResponse.json({ booking });
  } catch (err) {
    console.error('confirm-free error', err);
    return NextResponse.json({ error: 'Confirmation failed' }, { status: 500 });
  }
}
