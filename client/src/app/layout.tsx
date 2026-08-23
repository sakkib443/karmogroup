import type { Metadata } from "next";
import "./globals.css";
import { ReduxProvider } from "@/redux";
import FloatingContact from "@/components/shared/FloatingContact";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { brandCssVariables, brandFontsHref } from "@/config/brand";
import { rootMetadata } from "@/config/site";

export const metadata: Metadata = rootMetadata;

import { Toaster } from 'react-hot-toast';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Brand palette — generated from the single BRAND_PRIMARY constant in
            src/config/brand.ts and inlined server-side, so every
            var(--color-primary) resolves on the first paint (no colour flash). */}
        <style id="brand-palette" dangerouslySetInnerHTML={{ __html: brandCssVariables() }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Built from BRAND_FONT / BRAND_FONT_BANGLA in src/config/brand.ts, so
            changing the typeface there also changes what gets downloaded — no
            stale font request left behind. */}
        <link href={brandFontsHref()} rel="stylesheet" />
        {/* Explicit favicon links so production never falls back to a missing
            / missing-from-git icon. metadata.icons also points here; the query
            string busts CDN / browser caches after each deploy. */}
        <link rel="icon" href="/favicon.png?v=5" type="image/png" sizes="512x512" />
        <link rel="shortcut icon" href="/favicon.ico?v=5" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/favicon.png?v=5" />
      </head>
      <body>
        <ReduxProvider>
          <ThemeProvider>
            <Toaster position="top-center" reverseOrder={false} />
            {children}
            <FloatingContact />
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
