import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BagDrawer } from "@/components/BagDrawer";
import { PageView } from "@/components/PageView";
import { MotionProvider } from "@/components/MotionProvider";
import { JsonLd } from "@/components/JsonLd";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url + "/"),
  title: { default: "Fieldnote | Cologne mixed after you order", template: "%s | Fieldnote" },
  description: SITE.description,
  openGraph: { type: "website", siteName: "Fieldnote", title: "Fieldnote | Cologne mixed after you order", description: SITE.description },
  twitter: { card: "summary" },
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cellipse cx='16' cy='16' rx='11' ry='14' fill='%23F2F1EF' stroke='%23111111'/%3E%3Ctext x='16' y='21' text-anchor='middle' font-family='serif' font-size='14'%3EF%3C/text%3E%3C/svg%3E",
  },
};

export const viewport: Viewport = { themeColor: "#E6E5E3", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500&family=IBM+Plex+Mono:wght@400;500&family=Instrument+Serif&display=swap"
        />
        <JsonLd data={{ "@context": "https://schema.org", "@type": "Organization", name: "Fieldnote", url: SITE.url, email: SITE.email }} />
      </head>
      <body>
        <MotionProvider>
          <CartProvider>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <BagDrawer />
          <PageView />
        </CartProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
