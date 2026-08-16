import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(request) {
  try {
    const { amountPaise, receipt } = await request.json();

    if (!amountPaise || amountPaise < 100) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json(
        { error: 'Payments are not configured yet. Add RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET to your environment.' },
        { status: 500 }
      );
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount: amountPaise, // Razorpay expects the smallest currency unit (paise)
      currency: 'INR',
      receipt: receipt || `lf-${Date.now()}`,
    });

    return NextResponse.json({ order });
  } catch (err) {
    console.error('razorpay order error', err);
    return NextResponse.json({ error: 'Could not create payment order' }, { status: 500 });
  }
}
