'use client';

import { useRef, useState } from 'react';
import { Icon } from './IconSprite';

const REPLIES = {
  'pvt ltd': "A Private Limited Company usually takes 7–10 days end to end and starts at ₹6,999. Want me to open a free consultation for it?",
  'gst': "GST registration typically takes 3–5 working days once documents are in, starting at ₹1,499. I can point you to a GST specialist if you'd like.",
  'trademark': "Trademark applications are filed within 1–2 days of your consult, starting at ₹4,499. Objection handling is included if the mark gets challenged.",
  'pricing': "Pricing depends on the service — Pvt Ltd from ₹6,999, GST from ₹1,499, Trademark from ₹4,499. Every plan starts with a free 30-minute consultation.",
  'compliance': "Ongoing compliance covers ROC filings, annual returns and resolutions — priced per entity type. A case manager tracks every due date for you.",
  'fssai': "FSSAI licences are split into state and central categories depending on your turnover — happy to help you figure out which one applies.",
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { who: 'bot', text: "Namaste 👋 I'm the LEGOFIN assistant. Ask me about company registration, GST, trademarks, or any service — or tap a topic below." },
  ]);
  const [value, setValue] = useState('');
  const bodyRef = useRef(null);

  function scrollToEnd() {
    requestAnimationFrame(() => {
      if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    });
  }

  function respond(text) {
    const lower = text.toLowerCase();
    const key = Object.keys(REPLIES).find((k) => lower.includes(k));
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { who: 'bot', text: key ? REPLIES[key] : "Good question — that's best answered on a free call with a chartered expert. Want me to open the booking form?" },
      ]);
      scrollToEnd();
    }, 450);
  }

  function send(text) {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { who: 'user', text }]);
    setValue('');
    scrollToEnd();
    respond(text);
  }

  return (
    <>
      <button className="chat-fab" aria-label="Open assistant chat" onClick={() => setOpen((v) => !v)}>
        <Icon name="i-chat" style={{ width: 26, height: 26 }} />
        <span className="dot" />
      </button>

      {open && (
        <div className="chat-panel">
          <div className="chat-head">
            <div className="avatar" style={{ width: 38, height: 38, fontSize: 13 }}>CW</div>
            <div>
              <p style={{ fontWeight: 700, fontSize: '14.5px' }}>LEGOFIN Assistant</p>
              <span style={{ fontSize: '11.5px', color: 'var(--emerald)' }}>Online · Ask anything</span>
            </div>
            <button
              aria-label="Close chat"
              onClick={() => setOpen(false)}
              style={{ marginLeft: 'auto', width: 30, height: 30, borderRadius: '50%' }}
            >
              <Icon name="i-close" style={{ width: 15, height: 15 }} />
            </button>
          </div>
          <div className="chat-body" ref={bodyRef}>
            {messages.map((m, i) => (
              <div key={i} className={`msg ${m.who}`}>{m.text}</div>
            ))}
          </div>
          <div className="chat-chip-row">
            {['Pvt Ltd', 'GST', 'Trademark', 'Pricing'].map((chip) => (
              <button key={chip} className="chat-chip" onClick={() => send(chip)}>{chip}</button>
            ))}
          </div>
          <div className="chat-input-row">
            <input
              type="text"
              placeholder="Type a message…"
              aria-label="Chat message"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') send(value); }}
            />
            <button aria-label="Send" onClick={() => send(value)}>
              <Icon name="i-send" style={{ width: 16, height: 16 }} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
