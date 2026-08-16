import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createAdminClient } from '@/lib/supabase/server';
import { sendNotificationEmail } from '@/lib/email';

export async function POST(request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId,
    } = await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !bookingId) {
      return NextResponse.json({ error: 'Missing payment details' }, { status: 400 });
    }

    // Verify the HMAC signature Razorpay sends back — this is what proves
    // the payment is real and wasn't forged by a client-side script.
    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expected !== razorpay_signature) {
      return NextResponse.json({ error: 'Payment signature mismatch' }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data: booking, error } = await supabase
      .from('bookings')
      .update({
        status: 'confirmed',
        razorpay_order_id,
        razorpay_payment_id,
      })
      .eq('id', bookingId)
      .select()
      .single();

    if (error || !booking) {
      console.error('booking update error', error);
      return NextResponse.json({ error: 'Could not update booking' }, { status: 500 });
    }

    await notifyBookingConfirmed(booking);

    return NextResponse.json({ booking });
  } catch (err) {
    console.error('razorpay verify error', err);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}

export async function notifyBookingConfirmed(booking) {
  // auto-notify the client
  await sendNotificationEmail({
    to: booking.email,
    subject: `Booking confirmed — File No. ${booking.file_no}`,
    html: `
      <p>Hi ${booking.full_name},</p>
      <p>Your booking for <strong>${booking.service_name}</strong> is confirmed.</p>
      <p>File number: <strong>${booking.file_no}</strong></p>
      <p>Our case manager will call you within 2 hours.</p>
      <p>— LEGOFIN</p>
    `,
  });
  // auto-notify the internal team so a real human picks it up
  await sendNotificationEmail({
    subject: `New booking — ${booking.service_name} (${booking.file_no})`,
    html: `
      <p>New confirmed booking:</p>
      <ul>
        <li>File No: ${booking.file_no}</li>
        <li>Service: ${booking.service_name}</li>
        <li>Client: ${booking.full_name} — ${booking.email} ${booking.phone ? `— ${booking.phone}` : ''}</li>
        <li>Amount: ₹${(booking.amount_paise / 100).toLocaleString('en-IN')}</li>
      </ul>
    `,
  });
}
