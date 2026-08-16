import { createClient } from '@/lib/supabase/server';
import ExpertCard from '@/components/ExpertCard';

export const revalidate = 300;

export const metadata = {
  title: 'Experts — LEGOFIN',
  description: 'Verified chartered accountants and legal consultants, bookable in fixed 30-minute slots.',
};

export default async function ExpertsPage() {
  const supabase = createClient();
  const { data: consultants } = await supabase.from('consultants').select('*').order('rating', { ascending: false });

  return (
    <main className="section on-paper" style={{ background: 'var(--paper-0)', minHeight: '60vh' }}>
      <div className="container">
        <div className="section-head">
          <span className="eyebrow eyebrow--dark">Book directly</span>
          <h2>Every chartered expert.</h2>
          <p>Independently verified, rated by past clients, bookable in a fixed 30-minute slot.</p>
        </div>
        {consultants?.length ? (
          <div className="expert-grid">
            {consultants.map((c) => <ExpertCard key={c.id} consultant={c} />)}
          </div>
        ) : (
          <div className="empty-state">No experts listed yet.</div>
        )}
      </div>
    </main>
  );
}
