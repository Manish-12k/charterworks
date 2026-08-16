'use client';

// Escalating resend throttle:
//   attempts 1–4   → 5 min between each
//   attempts 5–7   → 10 min between each
//   attempts 8–9   → 45 min between each
//   attempts 10–11 → 2 hours between each
//   attempt 12+    → stays at 2 hours
// Persisted in localStorage per email so it survives a page refresh —
// this is a UX-level throttle, not a hard security control (someone could
// clear their browser storage to reset it); Supabase's own server-side
// auth rate limits remain the real backstop against abuse.

const TIERS = [
  { max: 4, cooldown: 5 * 60 },
  { max: 7, cooldown: 10 * 60 },
  { max: 9, cooldown: 45 * 60 },
  { max: 11, cooldown: 2 * 60 * 60 },
];
const FALLBACK_COOLDOWN = 2 * 60 * 60;
const STALE_AFTER_MS = 24 * 60 * 60 * 1000; // treat very old state as a fresh start

export function cooldownForAttempt(attemptNumber) {
  for (const tier of TIERS) {
    if (attemptNumber <= tier.max) return tier.cooldown;
  }
  return FALLBACK_COOLDOWN;
}

function storageKey(email) {
  return `cw_otp_throttle:${email.trim().toLowerCase()}`;
}

export function loadThrottleState(email) {
  if (typeof window === 'undefined' || !email) return { count: 0, nextAllowedAt: 0 };
  try {
    const raw = window.localStorage.getItem(storageKey(email));
    if (!raw) return { count: 0, nextAllowedAt: 0 };
    const state = JSON.parse(raw);
    if (Date.now() - state.nextAllowedAt > STALE_AFTER_MS) {
      return { count: 0, nextAllowedAt: 0 };
    }
    return state;
  } catch {
    return { count: 0, nextAllowedAt: 0 };
  }
}

// Call once when the OTP screen first appears (after the initial send) —
// starts the clock for how soon "Resend" becomes available.
export function initThrottle(email) {
  const existing = loadThrottleState(email);
  if (existing.count > 0) return existing; // already mid-sequence, keep it
  const state = { count: 0, nextAllowedAt: Date.now() + cooldownForAttempt(1) * 1000 };
  save(email, state);
  return state;
}

// Call when the user actually clicks "Resend".
export function recordResend(email) {
  const current = loadThrottleState(email);
  const nextCount = current.count + 1;
  const state = { count: nextCount, nextAllowedAt: Date.now() + cooldownForAttempt(nextCount) * 1000 };
  save(email, state);
  return state;
}

export function resetThrottle(email) {
  if (typeof window === 'undefined' || !email) return;
  try {
    window.localStorage.removeItem(storageKey(email));
  } catch {
    // ignore
  }
}

function save(email, state) {
  if (typeof window === 'undefined' || !email) return;
  try {
    window.localStorage.setItem(storageKey(email), JSON.stringify(state));
  } catch {
    // ignore — throttle just won't persist across a refresh
  }
}

export function secondsRemaining(nextAllowedAt) {
  return Math.max(0, Math.ceil((nextAllowedAt - Date.now()) / 1000));
}

export function formatCooldown(totalSeconds) {
  if (totalSeconds >= 3600) {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.round((totalSeconds % 3600) / 60);
    return `${h}h${m ? ' ' + m + 'm' : ''}`;
  }
  if (totalSeconds >= 60) {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}m${s ? ' ' + s + 's' : ''}`;
  }
  return `${totalSeconds}s`;
}
