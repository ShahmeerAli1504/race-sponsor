import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LenisProvider } from '@/components/common/LenisProvider';
import { Toaster } from 'sonner';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'RaceSponsor Pro | Athlete Sponsorship Marketplace & Live-Auction SaaS',
  description: 'Curated real-time athlete sponsorship marketplace. Sponsor elite HYROX, CrossFit, Triathlon, & Combat athletes on-body decals with 14-day pre-race hard cutoffs and anti-sniping protection.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-background text-slate-100 font-sans antialiased flex flex-col justify-between selection:bg-volt selection:text-black">
        <LenisProvider>
          <Header />
          <main className="flex-1 w-full">
            {children}
          </main>
          <Footer />

          {/* Toast Notifications */}
          <Toaster
            position="bottom-right"
            theme="dark"
            toastOptions={{
              style: {
                background: '#0E1217',
                border: '1px solid #1E2430',
                color: '#ffffff',
                fontFamily: 'var(--font-geist-mono)',
              },
            }}
          />
        </LenisProvider>
      </body>
    </html>
  );
}
