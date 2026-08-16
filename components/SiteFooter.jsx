import Link from 'next/link';
import { Icon } from './IconSprite';

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="brand">
              <svg width="34" height="34" viewBox="0 0 40 40" aria-hidden="true">
                <circle cx="20" cy="20" r="18" fill="none" stroke="#B8892B" strokeWidth="1.6" />
                <circle cx="20" cy="20" r="13.5" fill="none" stroke="#B8892B" strokeWidth="1" />
                <path d="M14 24V15.5L20 12l6 3.5V24" fill="none" stroke="#E0B368" strokeWidth="1.6" strokeLinejoin="round" />
                <line x1="14" y1="24" x2="26" y2="24" stroke="#E0B368" strokeWidth="1.6" />
              </svg>
              <span>LEGOFIN</span>
            </Link>
            <p>End-to-end business registration, GST, trademarks and compliance — run by chartered professionals, tracked like a case file.</p>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li><Link href="/services">Services</Link></li>
              <li><Link href="/experts">Experts</Link></li>
              <li><Link href="/login">Client Login</Link></li>
              <li><Link href="/login">Vendor Login</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Popular</h4>
            <ul>
              <li><Link href="/services/private-limited-company">Pvt Ltd Registration</Link></li>
              <li><Link href="/services/gst-registration">GST Registration</Link></li>
              <li><Link href="/services/trademark-registration">Trademark Filing</Link></li>
              <li><Link href="/services/fssai-licence">FSSAI Licence</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <ul className="footer-contact">
              <li><Icon name="i-pin" className="icon" style={{ width: 16, height: 16 }} />204, Aurum Business Tower, Netaji Subhash Place, New Delhi 110034</li>
              <li><Icon name="i-phone" className="icon" style={{ width: 16, height: 16 }} />+91 90000 00000</li>
              <li><Icon name="i-mail" className="icon" style={{ width: 16, height: 16 }} />hello@legofin.in</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} LEGOFIN Business Services Pvt. Ltd. — demo content, not a real filing.</span>
          <span><Link href="/privacy">Privacy</Link> · <Link href="/terms">Terms</Link></span>
        </div>
      </div>
    </footer>
  );
}
