import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import SignOutButton from '@/components/SignOutButton';

export const metadata = { title: 'Vendor Portal — LEGOFIN' };
export const dynamic = 'force-dynamic';

export default async function VendorPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="section">
        <div className="container">
          <p>Please <Link href="/login" style={{ color: 'var(--brass-light)' }}>sign in</Link> to view the vendor portal.</p>
        </div>
      </main>
    );
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, consultants(*)')
    .eq('id', user.id)
    .single();

  const isVendor = profile?.role === 'vendor' && profile?.consultant_id;

  const { data: cases } = isVendor
    ? await supabase.from('bookings').select('*').eq('consultant_id', profile.consultant_id).order('created_at', { ascending: false })
    : { data: [] };

  return (
    <main className="section">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <span className="eyebrow">Vendor Portal</span>
            <h1 style={{ fontFamily: 'var(--f-display)', fontSize: 32, marginTop: 10 }}>
              {isVendor ? profile.consultants.name : 'Vendor account'}
            </h1>
            <p style={{ marginTop: 6, color: 'var(--muted-on-ink)' }}>{user.email}</p>
          </div>
          <SignOutButton />
        </div>

        {!isVendor && (
          <div className="empty-state" style={{ marginTop: 40 }}>
            This account isn&rsquo;t linked to a consultant profile yet. An admin needs to set
            <code style={{ margin: '0 6px', fontFamily: 'var(--f-mono)' }}>role = &apos;vendor&apos;</code>
            and <code style={{ fontFamily: 'var(--f-mono)' }}>consultant_id</code> on your row in the
            <code style={{ margin: '0 6px', fontFamily: 'var(--f-mono)' }}>profiles</code> table (Supabase → Table Editor).
          </div>
        )}

        {isVendor && (
          <>
            <h2 style={{ fontSize: 20, marginTop: 44, marginBottom: 18 }}>Assigned cases</h2>
            {cases && cases.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table className="table-list">
                  <thead>
                    <tr><th>File No.</th><th>Client</th><th>Service</th><th>Status</th><th>Booked</th></tr>
                  </thead>
                  <tbody>
                    {cases.map((c) => (
                      <tr key={c.id}>
                        <td style={{ fontFamily: 'var(--f-mono)' }}>{c.file_no}</td>
                        <td>{c.full_name}</td>
                        <td>{c.service_name}</td>
                        <td><span className={`status-pill ${c.status}`}>{c.status.replace('_', ' ')}</span></td>
                        <td>{new Date(c.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">No cases assigned yet.</div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
