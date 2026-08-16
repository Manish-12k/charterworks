import Link from 'next/link';
import { Icon } from '@/components/IconSprite';

export const metadata = {
  title: 'Contact — LEGOFIN',
  description: 'Get in touch with the LEGOFIN team, or book a free 30-minute consultation.',
};

export default function ContactPage() {
  return (
    <main className="section">
      <div className="container" style={{ maxWidth: 640 }}>
        <span className="eyebrow">Get in touch</span>
        <h1 style={{ fontSize: 'clamp(30px,4vw,44px)', marginTop: 14 }}>Talk to a case manager.</h1>
        <p style={{ marginTop: 16, fontSize: 17, color: 'var(--muted-on-ink)' }}>
          Fastest way to get started is a free 30-minute call — or reach us directly below.
        </p>

        <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Icon name="i-phone" style={{ color: 'var(--brass-light)' }} />
            <span style={{ fontFamily: 'var(--f-mono)' }}>+91 90000 00000</span>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Icon name="i-mail" style={{ color: 'var(--brass-light)' }} />
            <span>hello@legofin.in</span>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <Icon name="i-pin" style={{ color: 'var(--brass-light)' }} />
            <span>204, Aurum Business Tower, Netaji Subhash Place, New Delhi 110034</span>
          </div>
        </div>

        <Link href="/book" className="btn btn-brass" style={{ marginTop: 32 }}>Book a Free Call</Link>
      </div>
    </main>
  );
}
