import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Icon } from '@/components/IconSprite';
import { formatRupees } from '@/lib/format';

export const revalidate = 300;

async function getService(slug) {
  const supabase = createClient();
  const { data } = await supabase.from('services').select('*').eq('slug', slug).single();
  return data;
}

export async function generateMetadata({ params }) {
  const service = await getService(params.slug);
  if (!service) return {};
  return {
    title: `${service.name} — LEGOFIN`,
    description: service.short_desc,
  };
}

export default async function ServiceDetailPage({ params }) {
  const service = await getService(params.slug);
  if (!service) notFound();

  return (
    <main className="section">
      <div className="container" style={{ maxWidth: 760 }}>
        <span className="eyebrow eyebrow--dark" style={{ color: 'var(--brass-light)' }}>{service.category}</span>
        <h1 style={{ fontSize: 'clamp(30px,4vw,44px)', marginTop: 14 }}>{service.name}</h1>
        <p style={{ marginTop: 16, fontSize: 17, color: 'var(--muted-on-ink)', maxWidth: '60ch' }}>
          {service.long_desc || service.short_desc}
        </p>

        <div style={{
          marginTop: 32, display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16,
          background: 'var(--ink-1)', border: '1px solid var(--ink-line)', borderRadius: 'var(--r-l)', padding: 28,
        }}>
          <div>
            <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11, textTransform: 'uppercase', color: 'var(--muted-on-ink)' }}>Turnaround</span>
            <strong style={{ display: 'block', fontSize: 20, marginTop: 6 }}>{service.turnaround || '—'}</strong>
          </div>
          <div>
            <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11, textTransform: 'uppercase', color: 'var(--muted-on-ink)' }}>Starting at</span>
            <strong style={{ display: 'block', fontSize: 20, marginTop: 6 }}>{service.price_label || formatRupees(service.price_paise)}</strong>
          </div>
        </div>

        <div style={{ marginTop: 32, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <Link
            href={`/book?service=${encodeURIComponent(service.name)}&serviceId=${service.id}`}
            className="btn btn-brass"
          >
            Book this service
          </Link>
          <Link href="/services" className="btn btn-ghost-ink">
            <Icon name="i-arrow" style={{ width: 14, height: 14, transform: 'scaleX(-1)' }} /> Back to all services
          </Link>
        </div>
      </div>
    </main>
  );
}
