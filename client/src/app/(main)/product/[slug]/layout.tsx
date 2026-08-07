import type { Metadata } from 'next';
import { API_URL as API_BASE, API_CONFIGURED } from '@/config/api';

async function getProduct(slug: string): Promise<any | null> {
    // Same trap as the sitemap: with no API configured this would be a
    // relative fetch on the server, which hangs rather than throwing, and the
    // `catch` below would never run. See src/config/api.ts.
    if (!API_CONFIGURED) return null;

    try {
        // Public product detail route — GET /api/products/slug/:slug
        const res = await fetch(`${API_BASE}/products/slug/${slug}`, {
            next: { revalidate: 300 },
        });
        if (!res.ok) return null;
        const json = await res.json();
        return json?.data ?? null;
    } catch {
        return null;
    }
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) {
        return {
            title: 'Product',
            description: 'Shop quality products at the best prices with S Kawsar Sunnah Mart.',
        };
    }

    const name: string = product.name || 'Product';
    const rawDesc: string = product.description || '';
    // Strip any HTML and trim to a sensible meta-description length.
    const description =
        rawDesc.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().slice(0, 160) ||
        `Buy ${name} at the best price on S Kawsar Sunnah Mart.`;
    const image: string | undefined = product.thumbnail || undefined;

    return {
        title: name,
        description,
        alternates: { canonical: `/product/${slug}` },
        openGraph: {
            type: 'website',
            title: name,
            description,
            url: `/product/${slug}`,
            images: image ? [{ url: image, alt: name }] : undefined,
        },
        twitter: {
            card: 'summary_large_image',
            title: name,
            description,
            images: image ? [image] : undefined,
        },
    };
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
    return children;
}
