import Link from 'next/link';
import { Icon } from './IconSprite';
import { formatRupees } from '@/lib/format';

export default function ExpertCard({ consultant }) {
  return (
    <article className="expert-card">
      <span className="verified-pill"><Icon name="i-check" style={{ width: 13, height: 13 }} />Verified</span>
      <div className="expert-top">
        <div className="avatar">{consultant.avatar_initials}</div>
        <div>
          <p className="expert-name">{consultant.name}</p>
          <p className="expert-role">{consultant.role} · {consultant.years_experience} yrs</p>
          {consultant.is_available && (
            <span className="available-dot"><i /> Available today</span>
          )}
        </div>
      </div>
      <div className="tag-row">
        {(consultant.tags || []).map((t) => <span key={t} className="tag">{t}</span>)}
      </div>
      <div className="expert-bottom">
        <span className="rating">
          <Icon name="i-star" />
          {consultant.rating} <span>({consultant.review_count})</span>
        </span>
      </div>
      <div className="price-row">
        <span className="price">{formatRupees(consultant.price_paise)} <span>/ 30 min</span></span>
        <Link
          href={`/book?consultant=${consultant.id}&service=${encodeURIComponent(consultant.name + ' — Consultation')}&amount=${consultant.price_paise}`}
          className="btn btn-brass btn-sm"
        >
          Book
        </Link>
      </div>
    </article>
  );
}
