'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  initThrottle, recordResend, resetThrottle, secondsRemaining, formatCooldown,
} from '@/lib/otpThrottle';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get('next') || '/account';

  const [stage, setStage] = useState('email'); // 'email' | 'otp'
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(0);

  // ticks the cooldown down once a second, whatever tier it's currently in
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  async function sendCode() {
    if (!email.trim()) { setError('Enter your email first.'); return; }
    setError('');
    setLoading(true);
    const supabase = createClient();
    const { error: sendError } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { data: { full_name: fullName || undefined }, shouldCreateUser: true },
    });
    setLoading(false);
    if (sendError) { setError(sendError.message); return; }
    setStage('otp');
    setOtp('');
    const state = initThrottle(email.trim());
    setCooldown(secondsRemaining(state.nextAllowedAt));
  }

  async function resendCode() {
    if (cooldown > 0 || loading) return;
    setError('');
    setLoading(true);
    const supabase = createClient();
    const { error: sendError } = await supabase.auth.signInWithOtp({ email: email.trim() });
    setLoading(false);
    if (sendError) { setError(sendError.message); return; }
    setOtp('');
    const state = recordResend(email.trim());
    setCooldown(secondsRemaining(state.nextAllowedAt));
  }

  async function verifyCode(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const supabase = createClient();
    const { error: verifyError } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: otp.trim(),
      type: 'email',
    });
    setLoading(false);
    if (verifyError) { setError(verifyError.message); return; }
    resetThrottle(email.trim()); // fresh start next time they sign in
    router.push(nextPath);
    router.refresh();
  }

  return (
    <main className="section" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
      <div className="container">
        <div className="card-panel">
          <span className="eyebrow eyebrow--dark" style={{ color: 'var(--brass-dim)' }}>Client &amp; Vendor Portal</span>
          <h1 style={{ fontFamily: 'var(--f-display)', fontSize: 26, marginTop: 8 }}>
            {stage === 'email' ? 'Sign in with email' : 'Enter your code'}
          </h1>
          <p style={{ marginTop: 8, fontSize: '13.5px', color: 'var(--muted-on-paper)' }}>
            {stage === 'email'
              ? 'No password to remember — we send a one-time code to your inbox, free and instant.'
              : `We sent a 6-digit code to ${email}.`}
          </p>

          {stage === 'email' && (
            <form onSubmit={(e) => { e.preventDefault(); sendCode(); }}>
              <div className="field" style={{ marginTop: 24 }}>
                <label htmlFor="fullName">Full name (first time only)</label>
                <input
                  id="fullName" className="input" type="text" placeholder="Your name"
                  value={fullName} onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="email">Email address</label>
                <input
                  id="email" className="input" type="email" placeholder="you@example.com" required
                  value={email} onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {error && <p className="error-note">{error}</p>}
              <button type="submit" className="btn btn-brass btn-block" disabled={loading} style={{ marginTop: 8 }}>
                {loading ? 'Sending…' : 'Send code →'}
              </button>
            </form>
          )}

          {stage === 'otp' && (
            <form onSubmit={verifyCode}>
              <div className="field" style={{ marginTop: 24 }}>
                <label htmlFor="otp">6-digit code</label>
                <input
                  id="otp" className="input" type="text" inputMode="numeric" maxLength={6}
                  placeholder="••••••" required value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  style={{ letterSpacing: 6, fontFamily: 'var(--f-mono)', fontSize: 18, textAlign: 'center' }}
                />
              </div>
              {error && <p className="error-note">{error}</p>}
              <button type="submit" className="btn btn-brass btn-block" disabled={loading} style={{ marginTop: 8 }}>
                {loading ? 'Verifying…' : 'Verify & sign in →'}
              </button>
              <button
                type="button"
                onClick={resendCode}
                disabled={cooldown > 0 || loading}
                className="btn btn-ghost-paper btn-block"
                style={{ marginTop: 10 }}
              >
                {cooldown > 0 ? `Resend code in ${formatCooldown(cooldown)}` : 'Resend code'}
              </button>
              <p className="form-foot" style={{ marginTop: 14 }}>
                <button type="button" onClick={() => { setStage('email'); setError(''); }}>← Use a different email</button>
              </p>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
