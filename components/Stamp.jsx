export default function Stamp({ label = 'VERIFIED', size = 88, animated = true, className = '' }) {
  const arcId = `stampArc-${label}-${size}`;
  return (
    <svg
      className={`stamp ${animated ? 'stamp-anim' : ''} ${className}`}
      style={{ width: size, height: size }}
      viewBox="0 0 120 120"
      aria-hidden="true"
    >
      <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3 4" />
      <circle cx="60" cy="60" r="43" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path id={arcId} d="M 60,17 A 43,43 0 1 1 59.9,17" fill="none" />
      <text fontSize="8.4" letterSpacing="2.6" fill="currentColor" fontWeight="600">
        <textPath href={`#${arcId}`} startOffset="1">LEGOFIN · {label} ·&#160;</textPath>
      </text>
      <text x="60" y="67" textAnchor="middle" fontSize="20" fontWeight="700" fill="currentColor">✓</text>
    </svg>
  );
}
