import type { Metadata } from "next";

/** Public site URL — set NEXT_PUBLIC_SITE_URL in production (Coolify/Vercel). */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://www.karmogroup.com";

export const SITE_NAME = "Karmo Group";

export const SITE_TITLE =
  "Karmo Group — Foam, HomeTex, Mattress and Chemicals since 1965";

export const SITE_DESCRIPTION =
  "Bangladesh's leading home brand. Foam, bedding, mattresses and industrial chemicals, manufactured in Bangladesh since 1965.";

export const SITE_KEYWORDS = [
  "karmo",
  "karmo group",
  "foam",
  "mattress",
  "hometex",
  "bedding",
  "chemicals",
  "bangladesh",
  "1965",
  "karmo foam",
  "karmo mattress",
];

/** Hero photograph — wide enough for WhatsApp / Facebook link previews. */
export const OG_IMAGE = "/karmo/images/home-02/hero/karmo-family-white-outfits.webp";

export const OG_IMAGE_ALT =
  "A Karmo family on a sofa — foam, mattress and HomeTex made in Bangladesh since 1965";

/** Root metadata wired into `src/app/layout.tsx`. */
export const rootMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  icons: {
    icon: [
      { url: "/favicon.png?v=5", type: "image/png", sizes: "512x512" },
      { url: "/favicon.ico?v=5", type: "image/x-icon", sizes: "48x48" },
    ],
    apple: "/favicon.png?v=5",
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: "en_US",
    url: SITE_URL,
    images: [
      {
        url: OG_IMAGE,
        width: 1920,
        height: 800,
        alt: OG_IMAGE_ALT,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
  robots: { index: true, follow: true },
};

/** Per-page metadata — merges title/description/path into the Karmo OG defaults. */
export function pageMetadata({
  title,
  description = SITE_DESCRIPTION,
  path = "/",
}: {
  title: string;
  description?: string;
  path?: string;
}): Metadata {
  const url = path === "/" ? SITE_URL : `${SITE_URL}${path}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      images: rootMetadata.openGraph?.images,
    },
    twitter: {
      title,
      description,
      images: [OG_IMAGE],
    },
  };
}
