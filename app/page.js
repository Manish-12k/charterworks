import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Icon } from '@/components/IconSprite';
import Stamp from '@/components/Stamp';
import ServiceCard from '@/components/ServiceCard';
import ExpertCard from '@/components/ExpertCard';

// Revalidate every 5 minutes — content stays fresh without hitting the
// database on every single request (keeps this well inside free-tier limits).
export const revalidate = 300;

async function getHomeData() {
  const supabase = createClient();
  const [{ data: services }, { data: consultants }, { data: testimonials }] = await Promise.all([
    supabase.from('services').select('*').order('sort_order').limit(8),
    supabase.from('consultants').select('*').order('rating', { ascending: false }).limit(3),
    supabase.from('testimonials').select('*').order('sort_order'),
  ]);
  return {
    services: services || [],
    consultants: consultants || [],
    testimonials: testimonials || [],
  };
}

export default async function HomePage() {
  const { services, consultants, testimonials } = await getHomeData();

  return (
    <main>
      {/* HERO */}
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Business Registration &amp; Compliance</span>
            <h1 className="h1">Every filing,<br /><em>chartered</em> and tracked.</h1>
            <p className="lede">
              Company registration, GST, trademarks and ongoing compliance, run by chartered
              accountants and legal consultants — followed through like an open case file,
              not a support ticket.
            </p>
            <div className="chip-row">
              <Link href="/services/private-limited-company" className="chip">Pvt Ltd Registration</Link>
              <Link href="/services/gst-registration" className="chip">GST Registration</Link>
              <Link href="/services/trademark-registration" className="chip">Trademark Filing</Link>
              <Link href="/services/llp-formation" className="chip">LLP Formation</Link>
            </div>
            <div className="hero-cta-row">
              <Link href="/book" className="btn btn-brass">Book a Free Consultation</Link>
              <Link href="/services" className="btn btn-ghost-ink">See all services</Link>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <div className="card-panel" style={{
              background: 'var(--paper-1)', display: 'flex', flexDirection: 'column', gap: 20,
              backgroundImage: 'repeating-linear-gradient(180deg, transparent 0 33px, var(--paper-line) 33px 34px)',
            }}>
              <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted-on-paper)' }}>
                    STARTUPS · MOST POPULAR
                  </div>
                  <h3 style={{ fontFamily: 'var(--f-display)', fontSize: 23, marginTop: 6 }}>Private Limited Company</h3>
                  <p style={{ marginTop: 8, fontSize: '13.5px', color: 'var(--muted-on-paper)', lineHeight: 1.55 }}>
                    The default structure for funded, scaling startups — separate legal identity, limited liability.
                  </p>
                  <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div>
                      <span style={{ display: 'block', fontFamily: 'var(--f-mono)', fontSize: '10.5px', textTransform: 'uppercase', color: 'var(--muted-on-paper)', marginBottom: 4 }}>Turnaround</span>
                      <strong style={{ fontSize: 15 }}>7–10 days</strong>
                    </div>
                    <div>
                      <span style={{ display: 'block', fontFamily: 'var(--f-mono)', fontSize: '10.5px', textTransform: 'uppercase', color: 'var(--muted-on-paper)', marginBottom: 4 }}>Starting at</span>
                      <strong style={{ fontSize: 15 }}>₹6,999 all-in</strong>
                    </div>
                  </div>
                </div>
                <Stamp label="VERIFIED" size={88} />
              </div>
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--muted-on-paper)', borderTop: '1px dashed var(--paper-line)', paddingTop: 14 }}>
                FILE NO. LF-{new Date().getFullYear()}-04831 · OPENED TODAY
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', borderTop: '1px solid var(--paper-line)', paddingTop: 16 }}>
                {[['912', 'Businesses onboarded'], ['2,340', 'Filings closed'], ['4.8', 'Average rating'], ['9', 'States served']].map(([n, l]) => (
                  <div key={l}>
                    <strong style={{ display: 'block', fontFamily: 'var(--f-display)', fontSize: 22 }}>{n}</strong>
                    <span style={{ display: 'block', fontSize: 11, color: 'var(--muted-on-paper)', marginTop: 2 }}>{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STRIP */}
      <section className="strip">
        <div className="container">
          <p>Free 30-minute consultation with a chartered expert <span>No commitment, no hidden charges</span></p>
          <Link href="/book" className="btn btn-ghost-paper" style={{ borderColor: 'rgba(251,248,241,.4)', color: '#fff' }}>Talk to an expert</Link>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section" id="services">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">What we file</span>
            <h2>Fourteen services, one case manager.</h2>
            <p>From first incorporation to the licences that keep you compliant — each service ships with a chartered professional and a tracked file.</p>
          </div>
          <div className="service-grid">
            {services.map((s) => <ServiceCard key={s.id} service={s} />)}
          </div>
          <div style={{ marginTop: 32, textAlign: 'center' }}>
            <Link href="/services" className="btn-text">View all services <Icon name="i-arrow" style={{ width: 14, height: 14 }} /></Link>
          </div>
        </div>
      </section>

      {/* EXPERTS */}
      <section className="section on-paper" style={{ background: 'var(--paper-0)' }} id="experts">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow eyebrow--dark">Book directly</span>
            <h2>Speak to a chartered expert today.</h2>
            <p>Every consultant is independently verified, rated by past clients, and bookable in a fixed 30-minute slot.</p>
          </div>
          <div className="expert-grid">
            {consultants.map((c) => <ExpertCard key={c.id} consultant={c} />)}
          </div>
          <div style={{ marginTop: 36, textAlign: 'center' }}>
            <Link href="/experts" className="btn-text" style={{ color: 'var(--brass-dim)' }}>View all experts <Icon name="i-arrow" style={{ width: 14, height: 14 }} /></Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Client files</span>
            <h2>What founders say once the filing&rsquo;s closed.</h2>
          </div>
          <div className="voice-track">
            {testimonials.map((t) => (
              <article key={t.id} className="voice-card">
                <p className="voice-quote">&ldquo;{t.quote}&rdquo;</p>
                <div className="voice-foot">
                  <div className="voice-person">
                    <div className="voice-avatar">{t.author_name.split(' ').map((w) => w[0]).slice(0, 2).join('')}</div>
                    <div><p>{t.author_name}</p><span>{t.author_role}</span></div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSER */}
      <section className="section" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="container">
          <div style={{
            border: '1px solid var(--ink-line)', borderRadius: 'var(--r-xl)', padding: 60,
            display: 'grid', gridTemplateColumns: '1.2fr .8fr', gap: 40, alignItems: 'center',
            background: 'var(--ink-2)',
          }} className="closer-box">
            <div>
              <span className="eyebrow">Start today</span>
              <h2>Open your file this week.</h2>
              <p style={{ marginTop: 14, color: 'var(--muted-on-ink)', maxWidth: '46ch' }}>
                Free consultation, transparent pricing, and a case manager who actually picks up.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'flex-start' }}>
              <Link href="/book" className="btn btn-brass btn-block">Book Free Call</Link>
              <span style={{ fontFamily: 'var(--f-mono)', fontSize: 15, color: 'var(--brass-light)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon name="i-phone" style={{ width: 16, height: 16 }} />+91 90000 00000
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
