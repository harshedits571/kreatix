import '@/app/globals.css';
import CustomCursor from '@/components/CustomCursor';
import SmoothScroll from '@/components/SmoothScroll';
import Script from 'next/script';

export const metadata = {
  title: 'Kreatix — High-CTR YouTube Thumbnail Designer & Packaging Strategist',
  description: 'Custom-crafted visual storytelling and high-CTR thumbnails for top YouTube creators. 500M+ views generated with 18.4% average CTR boost.',
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning>
        {/* Premium Physics Cursor */}
        <CustomCursor />

        {/* Mesh Gradient Animated Background */}
        <div className="gradient-bg">
          <div className="glow-orb orb-1"></div>
          <div className="glow-orb orb-2"></div>
          <div className="glow-orb orb-3"></div>
          <div className="grid-overlay"></div>
        </div>

        {/* Lenis Smooth Scroll Wrapper */}
        <SmoothScroll>
          {children}
        </SmoothScroll>

        {/* Lazy load Razorpay script */}
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
