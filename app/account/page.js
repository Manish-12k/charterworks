import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import SignOutButton from '@/components/SignOutButton';

export const metadata = { title: 'My Account — LEGOFIN' };
export const dynamic = 'force-dynamic'; // always show this user's live bookings

export default async function AccountPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // middleware.js already redirects signed-out visitors to /login,
  // this is just a defensive fallback.
  if (!user) {
    return (
      <main className="section">
        <div className="container">
          <p>Please <Link href="/login" style={{ color: 'var(--brass-light)' }}>sign in</Link> to view your account.</p>
        </div>
      </main>
    );
  }

  const { data: bookings } = await supabase
    .from('bookings')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <main className="section">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <span className="eyebrow">Client Portal</span>
            <h1 style={{ fontFamily: 'var(--f-display)', fontSize: 32, marginTop: 10 }}>Welcome back</h1>
            <p style={{ marginTop: 6, color: 'var(--muted-on-ink)' }}>{user.email}</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link href="/book" className="btn btn-brass btn-sm">New Booking</Link>
            <SignOutButton />
          </div>
        </div>

        <h2 style={{ fontSize: 20, marginTop: 44, marginBottom: 18 }}>Your filings</h2>

        {bookings && bookings.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="table-list">
              <thead>
                <tr>
                  <th>File No.</th>
                  <th>Service</th>
                  <th>Status</th>
                  <th>Booked</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id}>
                    <td style={{ fontFamily: 'var(--f-mono)' }}>{b.file_no}</td>
                    <td>{b.service_name}</td>
                    <td><span className={`status-pill ${b.status}`}>{b.status.replace('_', ' ')}</span></td>
                    <td>{new Date(b.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            No filings yet. <Link href="/book" style={{ color: 'var(--brass-light)' }}>Book your first service →</Link>
          </div>
        )}
      </div>
    </main>
  );
}
