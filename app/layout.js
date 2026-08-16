import { Inter, Fraunces, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import IconSprite from '@/components/IconSprite';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import ChatWidget from '@/components/ChatWidget';
import { createClient } from '@/lib/supabase/server';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces', display: 'swap', axes: ['opsz'] });
const plexMono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-plex-mono', display: 'swap' });

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'LEGOFIN — Company Registration, GST, Trademark & Compliance',
  description: 'End-to-end company registration, GST, trademark filing and ongoing compliance — run by chartered professionals and tracked like a case file.',
};

export default async function RootLayout({ children }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable} ${plexMono.variable}`}>
      <body>
        <IconSprite />
        <SiteHeader user={user} />
        {children}
        <SiteFooter />
        <ChatWidget />
      </body>
    </html>
  );
}
