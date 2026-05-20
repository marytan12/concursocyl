import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import AppChrome from '@/components/AppChrome';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: {
    default: 'CyL Joven | Agenda y descuentos',
    template: '%s | CyL Joven',
  },
  description:
    'Prototipo de app para descubrir planes, eventos y descuentos juveniles en Castilla y Leon usando datos publicos.',
  keywords: [
    'Castilla y Leon',
    'planes',
    'eventos',
    'descuentos',
    'Carnet Joven',
    'agenda cultural',
  ],
  authors: [{ name: 'Codex x CyL' }],
  applicationName: 'CyL Joven',
  category: 'open data',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#f6efe6',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" data-theme="light" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable}`}>
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  );
}
