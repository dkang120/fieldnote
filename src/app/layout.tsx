import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import { UiProvider } from "@/lib/ui";
import { Overlays } from "@/components/site/Overlays";
import { PageView } from "@/components/PageView";
import { MotionProvider } from "@/components/MotionProvider";
import { JsonLd } from "@/components/JsonLd";
import { ServiceWorker } from "@/components/ServiceWorker";
import { SITE, asset } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url + "/"),
  title: { default: "Fieldnote — Cologne made the day you order it", template: "%s | Fieldnote" },
  description: SITE.description,
  openGraph: { type: "website", siteName: "Fieldnote", title: "Fieldnote — Cologne made the day you order it", description: SITE.description },
  twitter: { card: "summary" },
  applicationName: "Fieldnote",
  appleWebApp: { capable: true, title: "Fieldnote", statusBarStyle: "default" },
  formatDetection: { telephone: false },
  icons: {
    apple: asset("/icons/apple-touch-icon.png"),
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cellipse cx='16' cy='16' rx='11' ry='14' fill='%23F7F4F0' stroke='%232B231F'/%3E%3Ctext x='16' y='21' text-anchor='middle' font-family='serif' font-size='14' fill='%232B231F'%3EF%3C/text%3E%3C/svg%3E",
  },
};

export const viewport: Viewport = { themeColor: "#2B231F", width: "device-width", initialScale: 1 };

/* Sets the zoom for each breakpoint frame before first paint (see .bp-* in globals.css).
   Frames scale with the window; the phone and tablet frames stop growing at 1.2× and center. */
const SCALE = `(function(){var d=document.documentElement;function s(){var w=d.clientWidth||innerWidth;d.style.setProperty('--zp',Math.min(w/390,1.2));d.style.setProperty('--zt',Math.min(w/768,1.3));d.style.setProperty('--zd',Math.min(w/1440,1.4));}s();addEventListener('resize',s);})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: SCALE }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300..700;1,300..700&family=IBM+Plex+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&display=swap"
        />
        <JsonLd data={{ "@context": "https://schema.org", "@type": "Organization", name: "Fieldnote", url: SITE.url, email: SITE.email }} />
      </head>
      <body>
        <MotionProvider>
          <CartProvider>
            <UiProvider>
              <main id="main">{children}</main>
              <Overlays />
              <PageView />
              <ServiceWorker />
            </UiProvider>
          </CartProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
