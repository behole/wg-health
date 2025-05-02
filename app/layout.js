import '../styles/globals.css';

export const viewport = {
  width: 'device-width',
  initialScale: 1, 
  maximumScale: 5,
  viewportFit: 'cover'
};

export const metadata = {
  title: "Mary's Daily Page",
  description: 'A personalized daily assistant for Mary',
  manifest: '/manifest.json',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="format-detection" content="telephone=yes" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="min-h-screen bg-white">
        <div className="max-w-lg mx-auto px-4 py-4 pb-24">
          {children}
        </div>
      </body>
    </html>
  );
}
