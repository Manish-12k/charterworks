'use client';

import { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { createClient } from '@/lib/supabase/client';
import { formatRupees, generateFileNo } from '@/lib/format';
import {
  initThrottle, recordResend, resetThrottle, secondsRemaining, formatCooldown,
} from '@/lib/otpThrottle';
import Stamp from './Stamp';

const PAY_METHODS = [
  { key: 'upi', label: 'UPI / QR Code', tag: 'Instant' },
  { key: 'card', label: 'Credit / Debit Card', tag: 'Visa · Mastercard' },
  { key: 'netbanking', label: 'Net Banking', tag: 'All major banks' },
];

export default function BookingFlow({
  services, initialServiceName, initialServiceId, initialConsultantId, initialAmountPaise, userEmail, userId,
}) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const options = useMemo(() => {
    const list = services.map((s) => ({ id: s.id, name: s.name, price_paise: s.price_paise }));
    list.push({ id: '', name: 'General Consultation', price_paise: null });
    if (initialServiceId && !list.some((o) => o.id === initialServiceId)) {
      list.unshift({ id: initialServiceId, name: initialServiceName, price_paise: initialAmountPaise ?? null });
    } else if (!initialServiceId && initialServiceName && !list.some((o) => o.name === initialServiceName)) {
      list.unshift({ id: 'custom', name: initialServiceName, price_paise: initialAmountPaise ?? null });
    }
    return list;
  }, [services, initialServiceId, initialServiceName, initialAmountPaise]);

  const [step, setStep] = useState(1);
  const [selectedId, setSelectedId] = useState(initialServiceId || (options[0]?.id ?? ''));
  const selected = options.find((o) => o.id === selectedId) || options[0];

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState(userEmail || '');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const [payMethod, setPayMethod] = useState('upi');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookingId, setBookingId] = useState(null);
  const [fileNo, setFileNo] = useState('');

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  async function createBookingRow(uid) {
    const newFileNo = generateFileNo();
    const { data, error: insertError } = await supabase
      .from('bookings')
      .insert({
        file_no: newFileNo,
        user_id: uid || null,
        service_id: selected.id && selected.id !== 'custom' ? selected.id : null,
        service_name: selected.name,
        consultant_id: initialConsultantId || null,
        full_name: fullName,
        email,
        phone,
        amount_paise: selected.price_paise || 0,
        status: 'pending',
      })
      .select()
      .single();

    if (insertError) throw insertError;
    setBookingId(data.id);
    setFileNo(data.file_no);
    return data;
  }

  async function handleDetailsSubmit(e) {
    e.preventDefault();
    setError('');
    if (!fullName.trim() || !email.trim()) { setError('Name and email are required.'); return; }
    setLoading(true);
    try {
      if (userId) {
        // already signed in — no OTP needed, go straight to payment
        await createBookingRow(userId);
        setStep(3);
      } else {
        const { error: otpError } = await supabase.auth.signInWithOtp({
          email: email.trim(),
          options: { data: { full_name: fullName }, shouldCreateUser: true },
        });
        if (otpError) throw otpError;
        const state = initThrottle(email.trim());
        setCooldown(secondsRemaining(state.nextAllowedAt));
        setStep(2);
      }
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  async function resendOtp() {
    if (cooldown > 0) return;
    setLoading(true);
    setError('');
    const { error: otpError } = await supabase.auth.signInWithOtp({ email: email.trim() });
    setLoading(false);
    if (otpError) { setError(otpError.message); return; }
    const state = recordResend(email.trim());
    setCooldown(secondsRemaining(state.nextAllowedAt));
  }

  async function handleVerifyOtp(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email: email.trim(), token: otp.trim(), type: 'email',
      });
      if (verifyError) throw verifyError;
      resetThrottle(email.trim());
      await createBookingRow(data.user?.id);
      setStep(3);
    } catch (err) {
      setError(err.message || 'Invalid code — please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirmFree() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/booking/confirm-free', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Could not confirm booking');
      setStep(4);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handlePay() {
    setLoading(true);
    setError('');
    try {
      const orderRes = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amountPaise: selected.price_paise, receipt: bookingId }),
      });
      const orderJson = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderJson.error || 'Could not start payment');

      if (typeof window.Razorpay === 'undefined') {
        throw new Error('Payment script is still loading — try again in a moment.');
      }

      const methodMap = { upi: 'upi', card: 'card', netbanking: 'netbanking' };
      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderJson.order.amount,
        currency: 'INR',
        name: 'LEGOFIN',
        description: selected.name,
        order_id: orderJson.order.id,
        prefill: { name: fullName, email, contact: phone },
        method: { [methodMap[payMethod]]: true },
        theme: { color: '#B8892B' },
        handler: async (response) => {
          try {
            const verifyRes = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...response, bookingId }),
            });
            const verifyJson = await verifyRes.json();
            if (!verifyRes.ok) throw new Error(verifyJson.error || 'Payment verification failed');
            setStep(4);
          } catch (err) {
            setError(err.message);
          } finally {
            setLoading(false);
          }
        },
        modal: { ondismiss: () => setLoading(false) },
      });
      rzp.open();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  const segClass = (n) => (step > n ? 'seg is-done' : step === n ? 'seg is-active' : 'seg');

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      <div className="card-panel">
        <span className="eyebrow eyebrow--dark" style={{ color: 'var(--brass-dim)' }}>
          Step {step} of {step >= 3 && !selected.price_paise ? 3 : 4}
        </span>
        <h1 style={{ fontFamily: 'var(--f-display)', fontSize: 26, marginTop: 8 }}>
          {step === 1 && 'Tell us what you need'}
          {step === 2 && 'Verify your email'}
          {step === 3 && 'Confirm & pay'}
          {step === 4 && 'Booking confirmed!'}
        </h1>

        {step < 4 && (
          <div className="step-track">
            <div className={segClass(1)}><i /></div>
            <div className={segClass(2)}><i /></div>
            <div className={segClass(3)}><i /></div>
          </div>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <form onSubmit={handleDetailsSubmit}>
            <div className="field">
              <label htmlFor="svc">Service</label>
              <select id="svc" className="select" value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
                {options.map((o) => (
                  <option key={o.id || o.name} value={o.id}>{o.name}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="name">Full name</label>
              <input id="name" className="input" type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your name" />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" disabled={!!userEmail} />
            </div>
            <div className="field">
              <label htmlFor="phone">Mobile number (optional)</label>
              <input id="phone" className="input" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="98XXXXXX10" />
              <p className="field-hint">We'll call this number if your case manager needs to reach you faster than email.</p>
            </div>
            {error && <p className="error-note">{error}</p>}
            <button type="submit" className="btn btn-brass btn-block" disabled={loading} style={{ marginTop: 8 }}>
              {loading ? 'Please wait…' : userId ? 'Continue →' : 'Send verification code →'}
            </button>
          </form>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp}>
            <p className="field-hint" style={{ marginBottom: 16 }}>We sent a 6-digit code to {email} — free, no SMS charges.</p>
            <div className="field">
              <label htmlFor="otp">6-digit code</label>
              <input
                id="otp" className="input" type="text" inputMode="numeric" maxLength={6} required
                value={otp} onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                style={{ letterSpacing: 6, fontFamily: 'var(--f-mono)', fontSize: 18, textAlign: 'center' }}
              />
            </div>
            {error && <p className="error-note">{error}</p>}
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button type="button" className="btn btn-ghost-paper" onClick={() => setStep(1)}>Back</button>
              <button type="submit" className="btn btn-brass" style={{ flex: 1 }} disabled={loading}>
                {loading ? 'Verifying…' : 'Verify & continue →'}
              </button>
            </div>
            <button
              type="button" onClick={resendOtp} disabled={cooldown > 0 || loading}
              className="btn btn-ghost-paper btn-block" style={{ marginTop: 10 }}
            >
              {cooldown > 0 ? `Resend code in ${formatCooldown(cooldown)}` : 'Resend code'}
            </button>
          </form>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div>
            <div className="summary-row"><span>{selected.name}</span><span>{formatRupees(selected.price_paise)}</span></div>
            <div className="summary-row total"><span>Total due today</span><span>{formatRupees(selected.price_paise)}</span></div>

            {selected.price_paise ? (
              <div className="pay-methods">
                {PAY_METHODS.map((m) => (
                  <label key={m.key} className={`pay-method ${payMethod === m.key ? 'is-selected' : ''}`}>
                    <input type="radio" name="pay" checked={payMethod === m.key} onChange={() => setPayMethod(m.key)} />
                    <span className="pm-name">{m.label}</span>
                    <span style={{ fontSize: 11, color: 'var(--muted-on-paper)', fontFamily: 'var(--f-mono)' }}>{m.tag}</span>
                  </label>
                ))}
              </div>
            ) : (
              <p className="field-hint" style={{ margin: '18px 0' }}>This is a free consultation — nothing to pay today.</p>
            )}

            {error && <p className="error-note">{error}</p>}
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button type="button" className="btn btn-ghost-paper" onClick={() => setStep(1)}>Back</button>
              <button
                type="button" className="btn btn-brass" style={{ flex: 1 }} disabled={loading}
                onClick={selected.price_paise ? handlePay : handleConfirmFree}
              >
                {loading ? 'Processing…' : selected.price_paise ? 'Pay Securely' : 'Confirm Booking'}
              </button>
            </div>
            {selected.price_paise > 0 && (
              <p style={{ marginTop: 14, fontSize: '11.5px', color: 'var(--muted-on-paper)', textAlign: 'center' }}>
                256-bit SSL · Secured by Razorpay
              </p>
            )}
          </div>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <div className="confirm-wrap">
            <div style={{ margin: '0 auto 18px', width: 110 }}>
              <Stamp label="FILED" size={110} />
            </div>
            <span className="file-no">FILE NO. {fileNo}</span>
            <p style={{ marginTop: 16, fontSize: '13.5px', color: 'var(--muted-on-paper)' }}>
              Our case manager will be in touch within 2 hours. A confirmation has been sent to {email}.
            </p>
            <button
              className="btn btn-brass btn-block" style={{ marginTop: 22 }}
              onClick={() => router.push(userId || bookingId ? '/account' : '/')}
            >
              Done
            </button>
          </div>
        )}
      </div>
    </>
  );
}
