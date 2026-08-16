export const metadata = { title: 'Terms of Service — LEGOFIN' };

export default function TermsPage() {
  return (
    <main className="section">
      <div className="container" style={{ maxWidth: 720 }}>
        <h1 style={{ fontSize: 'clamp(28px,4vw,40px)' }}>Terms of Service</h1>
        <p style={{ marginTop: 20, color: 'var(--muted-on-ink)', lineHeight: 1.7 }}>
          This is placeholder terms text. Replace it with your actual service terms — refund and
          cancellation policy for paid consultations, liability limits, and dispute resolution —
          ideally reviewed by an actual lawyer before this site takes real payments.
        </p>
      </div>
    </main>
  );
}
