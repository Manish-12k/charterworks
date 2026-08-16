export const metadata = { title: 'Privacy Policy — LEGOFIN' };

export default function PrivacyPage() {
  return (
    <main className="section">
      <div className="container" style={{ maxWidth: 720 }}>
        <h1 style={{ fontSize: 'clamp(28px,4vw,40px)' }}>Privacy Policy</h1>
        <p style={{ marginTop: 20, color: 'var(--muted-on-ink)', lineHeight: 1.7 }}>
          This is placeholder policy text. Replace it with your actual data-handling practices —
          what you collect (name, phone, email, payment metadata), why, how long it&rsquo;s kept,
          which third parties process it (Supabase for storage, Razorpay for payments), and how
          someone can request deletion — before taking this site live.
        </p>
      </div>
    </main>
  );
}
