'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Icon } from './IconSprite';

const NAV = [
  { label: 'Startups', href: '/services?cat=startups' },
  { label: 'Compliance', href: '/services?cat=compliance' },
  { label: 'Licences', href: '/services?cat=licences' },
  { label: 'Funding', href: '/services?cat=funding' },
  { label: 'Experts', href: '/experts' },
  { label: 'Contact', href: '/contact' },
];

export default function SiteHeader({ user }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="site-header">
        <div className="container nav-row">
          <Link href="/" className="brand">
            <svg width="34" height="34" viewBox="0 0 40 40" aria-hidden="true">
              <circle cx="20" cy="20" r="18" fill="none" stroke="#B8892B" strokeWidth="1.6" />
              <circle cx="20" cy="20" r="13.5" fill="none" stroke="#B8892B" strokeWidth="1" />
              <path d="M14 24V15.5L20 12l6 3.5V24" fill="none" stroke="#E0B368" strokeWidth="1.6" strokeLinejoin="round" />
              <line x1="14" y1="24" x2="26" y2="24" stroke="#E0B368" strokeWidth="1.6" />
            </svg>
            <span>LEGOFIN<small>Business &amp; Compliance</small></span>
          </Link>

          <nav className="primary-nav" aria-label="Primary">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="nav-link">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="nav-actions">
            <Link href={user ? '/account' : '/login'} className="btn btn-ghost-ink btn-sm">
              {user ? 'My Account' : 'Login / Register'}
            </Link>
            <Link href="/book" className="btn btn-brass btn-sm">Book a Call</Link>
            <button
              aria-label="Open menu"
              onClick={() => setMobileOpen((v) => !v)}
              className="btn btn-ghost-ink btn-sm hamburger-btn"
              style={{ width: 40, padding: 0 }}
            >
              <Icon name={mobileOpen ? 'i-close' : 'i-menu'} />
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div style={{
          position: 'fixed', inset: '76px 0 0 0', background: 'var(--ink-1)', zIndex: 59,
          padding: '20px 24px 40px', overflowY: 'auto',
        }}>
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              style={{ display: 'block', padding: '14px 0', fontWeight: 600, fontSize: 16, borderBottom: '1px solid var(--ink-line)' }}
            >
              {item.label}
            </Link>
          ))}
          <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Link href={user ? '/account' : '/login'} className="btn btn-ghost-ink btn-block" onClick={() => setMobileOpen(false)}>
              {user ? 'My Account' : 'Login / Register'}
            </Link>
            <Link href="/book" className="btn btn-brass btn-block" onClick={() => setMobileOpen(false)}>Book a Free Call</Link>
          </div>
        </div>
      )}
    </>
  );
}
