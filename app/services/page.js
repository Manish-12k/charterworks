import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import ServiceCard from '@/components/ServiceCard';
import { SERVICE_CATEGORIES } from '@/lib/format';

export const revalidate = 300;

export const metadata = {
  title: 'All Services — LEGOFIN',
  description: 'Company registration, compliance, licences and funding services, run end to end by chartered professionals.',
};

export default async function ServicesPage({ searchParams }) {
  const activeCat = searchParams?.cat;
  const supabase = createClient();
  const { data: services } = await supabase.from('services').select('*').order('sort_order');

  const filtered = activeCat
    ? (services || []).filter((s) => s.category === activeCat)
    : (services || []);

  return (
    <main className="section">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">What we file</span>
          <h2>All services.</h2>
          <p>Filter by category, or browse everything we handle end to end.</p>
        </div>

        <div className="cat-tabs">
          <Link href="/services" className={`cat-tab ${!activeCat ? 'is-active' : ''}`}>All</Link>
          {SERVICE_CATEGORIES.map((c) => (
            <Link
              key={c.key}
              href={`/services?cat=${c.key}`}
              className={`cat-tab ${activeCat === c.key ? 'is-active' : ''}`}
            >
              {c.label}
            </Link>
          ))}
        </div>

        {filtered.length > 0 ? (
          <div className="service-grid">
            {filtered.map((s) => <ServiceCard key={s.id} service={s} />)}
          </div>
        ) : (
          <div className="empty-state">No services found in this category yet.</div>
        )}
      </div>
    </main>
  );
}
