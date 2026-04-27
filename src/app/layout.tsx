import type { Metadata } from 'next';
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
  title: 'CyL Joven | Agenda y descuentos',
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" data-theme="light" suppressHydrationWarning>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <meta name="theme-color" content="#f6efe6" />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable}`}>
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  );
}
