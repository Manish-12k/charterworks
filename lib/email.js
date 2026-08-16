// Sends via Resend's REST API directly (no extra SDK dependency needed).
// Fails silently (logs, doesn't throw) so a flaky email never blocks a booking.
export async function sendNotificationEmail({ subject, html, to }) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set — skipping email:', subject);
    return { skipped: true };
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.NOTIFY_EMAIL_FROM || 'LEGOFIN <onboarding@resend.dev>',
        to: to || process.env.NOTIFY_EMAIL_TO,
        subject,
        html,
      }),
    });
    if (!res.ok) {
      console.error('Resend error', await res.text());
      return { ok: false };
    }
    return { ok: true };
  } catch (err) {
    console.error('sendNotificationEmail failed', err);
    return { ok: false };
  }
}
