// Renders once in the root layout. Every <Icon name="i-x" /> elsewhere
// references these via <use>, so the markup only ships once.
export default function IconSprite() {
  return (
    <svg className="visually-hidden" aria-hidden="true">
      <symbol id="i-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9" /></symbol>
      <symbol id="i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.2" y2="16.2" /></symbol>
      <symbol id="i-arrow" viewBox="0 0 24 24"><line x1="4" y1="12" x2="20" y2="12" /><polyline points="13 5 20 12 13 19" /></symbol>
      <symbol id="i-menu" viewBox="0 0 24 24"><line x1="4" y1="7" x2="20" y2="7" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="17" x2="20" y2="17" /></symbol>
      <symbol id="i-close" viewBox="0 0 24 24"><line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" /></symbol>
      <symbol id="i-star" viewBox="0 0 24 24"><polygon points="12 2 15 9 22 9.5 16.5 14 18.5 21 12 17 5.5 21 7.5 14 2 9.5 9 9" /></symbol>
      <symbol id="i-check" viewBox="0 0 24 24"><polyline points="4 12.5 9.5 18 20 6" /></symbol>
      <symbol id="i-lock" viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></symbol>
      <symbol id="i-phone" viewBox="0 0 24 24"><path d="M6 3h3l1.5 4.5-2 1.5a12 12 0 0 0 6.5 6.5l1.5-2L21 15v3a2 2 0 0 1-2 2C10.5 20 4 13.5 4 5a2 2 0 0 1 2-2z" /></symbol>
      <symbol id="i-mail" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" /><polyline points="3 7 12 13 21 7" /></symbol>
      <symbol id="i-pin" viewBox="0 0 24 24"><path d="M12 21s7-6.7 7-12a7 7 0 0 0-14 0c0 5.3 7 12 7 12z" /><circle cx="12" cy="9" r="2.4" /></symbol>
      <symbol id="i-send" viewBox="0 0 24 24"><line x1="4" y1="20" x2="20" y2="4" /><polygon points="20 4 13 20 10 13 4 10" /></symbol>
      <symbol id="i-chat" viewBox="0 0 24 24"><path d="M4 5h16v11H8l-4 4V5z" /></symbol>
      <symbol id="i-building" viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="1" /><line x1="9" y1="7.5" x2="9" y2="7.6" /><line x1="15" y1="7.5" x2="15" y2="7.6" /><line x1="9" y1="11.5" x2="9" y2="11.6" /><line x1="15" y1="11.5" x2="15" y2="11.6" /><line x1="9" y1="15.5" x2="9" y2="15.6" /><line x1="15" y1="15.5" x2="15" y2="15.6" /><rect x="10" y="17.5" width="4" height="3.5" /></symbol>
      <symbol id="i-users" viewBox="0 0 24 24"><circle cx="9" cy="8" r="3" /><path d="M4 20c0-3.3 2.4-5.5 5-5.5s5 2.2 5 5.5" /><circle cx="17.5" cy="9.5" r="2.3" /><path d="M15 20c0-2.4 1.3-4.4 3.2-4.9" /></symbol>
      <symbol id="i-leaf" viewBox="0 0 24 24"><path d="M5 19c8 0 13-5 13-13-8 0-13 5-13 13z" /><path d="M5 19c2-4.5 5-7.5 9-9.5" /></symbol>
      <symbol id="i-tag" viewBox="0 0 24 24"><path d="M3 12 12 3h6a2 2 0 0 1 2 2v6l-9 9a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8z" /><circle cx="16" cy="8" r="1.5" /></symbol>
      <symbol id="i-percent" viewBox="0 0 24 24"><circle cx="7.5" cy="7.5" r="2.5" /><circle cx="16.5" cy="16.5" r="2.5" /><line x1="18" y1="6" x2="6" y2="18" /></symbol>
      <symbol id="i-utensils" viewBox="0 0 24 24"><line x1="6" y1="3" x2="6" y2="21" /><path d="M4 3v6a2 2 0 0 0 4 0V3" /><path d="M18 3c-2.2 0-3.4 2-3.4 5.2 0 2.6 1 4 3.4 4.4V21" /></symbol>
      <symbol id="i-globe" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><line x1="3" y1="12" x2="21" y2="12" /><ellipse cx="12" cy="12" rx="4" ry="9" /></symbol>
      <symbol id="i-cert" viewBox="0 0 24 24"><rect x="4" y="3" width="16" height="12" rx="1.5" /><line x1="7.5" y1="7" x2="16.5" y2="7" /><line x1="7.5" y1="10.5" x2="13.5" y2="10.5" /><circle cx="9" cy="19" r="2.3" /><path d="M6.9 20.4 6 23l3-1.2 3 1.2-.9-2.6" /></symbol>
      <symbol id="i-filecheck" viewBox="0 0 24 24"><path d="M6 2h9l4 4v16H6z" /><path d="M15 2v4h4" /><polyline points="8.5 13.5 11 16 16 10.5" /></symbol>
      <symbol id="i-rocket" viewBox="0 0 24 24"><path d="M12 2c3 2 4.2 6.4 3 11.4l-3 3-3-3C7.8 8.4 9 4 12 2z" /><circle cx="12" cy="9.2" r="1.4" /><path d="M9 15.4l-3 3 .8 3 3-.8" /><path d="M15 15.4l3 3-.8 3-3-.8" /></symbol>
      <symbol id="i-coin" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 6.5v11" /><path d="M9 9.2c0-1.5 1.3-2.4 3-2.4s3 .9 3 2.1c0 2.8-6 1.4-6 4.2 0 1.2 1.3 2.1 3 2.1s3-.9 3-2.3" /></symbol>
    </svg>
  );
}

export function Icon({ name, className = 'icon', style }) {
  return (
    <svg className={className} style={style}>
      <use href={`#${name}`} />
    </svg>
  );
}
