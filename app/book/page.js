import { createClient } from '@/lib/supabase/server';
import BookingFlow from '@/components/BookingFlow';

export const metadata = { title: 'Book a Consultation — LEGOFIN' };
export const revalidate = 300;

export default async function BookPage({ searchParams }) {
  const supabase = createClient();
  const [{ data: services }, { data: { user } }] = await Promise.all([
    supabase.from('services').select('*').order('sort_order'),
    supabase.auth.getUser(),
  ]);

  return (
    <main className="section" style={{ minHeight: '75vh' }}>
      <div className="container">
        <BookingFlow
          services={services || []}
          initialServiceName={searchParams?.service || ''}
          initialServiceId={searchParams?.serviceId || ''}
          initialConsultantId={searchParams?.consultant || ''}
          initialAmountPaise={searchParams?.amount ? parseInt(searchParams.amount, 10) : null}
          userEmail={user?.email || ''}
          userId={user?.id || ''}
        />
      </div>
    </main>
  );
}
