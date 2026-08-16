import Link from 'next/link';
import { Icon } from './IconSprite';

export default function ServiceCard({ service }) {
  return (
    <Link href={`/services/${service.slug}`} className="service-card">
      <span className="icon-wrap"><Icon name={service.icon} /></span>
      <h3>{service.name}</h3>
      <p>{service.short_desc}</p>
      <span className="go">Explore <Icon name="i-arrow" style={{ width: 12, height: 12 }} /></span>
    </Link>
  );
}
