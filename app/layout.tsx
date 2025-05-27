import type { Metadata, Viewport } from 'next';
import { AppProvider } from '@/lib/context/AppContext';
import { ErrorBoundary } from '@/components/ui';
import '../styles/globals.css';
import '../styles/onboarding-fix.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover'
};

export const metadata: Metadata = {
  title: "Plan'd v2 - Beta Test",
  description: 'Plan\'d v2 - A modernized family planning and organization app',
  manifest: '/manifest.json',
  icons: {
    apple: '/apple-touch-icon.png',
  },
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'format-detection': 'telephone=yes',
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="format-detection" content="telephone=yes" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="min-h-screen bg-white">
        <ErrorBoundary>
          <AppProvider>
            <div className="max-w-lg mx-auto px-4 py-4 pb-24">
              <ErrorBoundary>
                {children}
              </ErrorBoundary>
            </div>
          </AppProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}