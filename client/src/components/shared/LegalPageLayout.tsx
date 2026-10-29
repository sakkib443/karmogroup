"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useGetLegalPageQuery } from '@/redux/api/siteContentApi';

interface LegalPageProps {
    slug: string;
    fallbackTitle: string;
    /** Big content heading, e.g. "Terms and Conditions – Karmo Group". */
    heading?: string;
    /** Static HTML content (keeps the page useful without the CMS). */
    fallbackContent?: string;
    /* Legacy props — accepted but no longer used by this layout. */
    icon?: React.ReactNode;
    accentColor?: string;
    ctaTitle?: string;
    ctaDescription?: string;
    ctaButtonText?: string;
}

/* Same offer SKUs as the live "Products" sidebar on karmogroup.com — pulled from
   the pillow catalogue (client/src/app/(karmo-2)/hometex/pillow/page.jsx). */
const PILLOW_IMG = "/products/hometex/pillow";
const PRODUCTS = [
    { name: "Plush Pillow Combo Offer", image: `${PILLOW_IMG}/plush-combo.webp`, price: "৳ 2,599" },
    { name: "RelaxTime Pillow Combo Offer", image: `${PILLOW_IMG}/relax-combo.webp`, price: "৳ 1,599" },
    { name: "RelaxTime Pillow Combo Offer", image: `${PILLOW_IMG}/relax-combo-999.webp`, price: "৳ 999" },
    { name: "6 RelaxTime Cushion Offer", image: `${PILLOW_IMG}/6-cushion.webp`, price: "৳ 1,240" },
    { name: "4 RelaxTime Cushion Offer", image: `${PILLOW_IMG}/4-cushion.webp`, price: "৳ 850" },
];
const PRODUCTS_HREF = "/hometex/pillow";

const LegalPageLayout = ({ slug, fallbackTitle, heading, fallbackContent }: LegalPageProps) => {
    const { data: response } = useGetLegalPageQuery(slug);
    const page = response?.data;

    const title = page?.title || fallbackTitle;
    const bigHeading = heading || `${title} – Karmo Group`;
    const content = fallbackContent || page?.content || '<p>Content coming soon.</p>';

    return (
        <div style={{ background: '#fff' }}>
            {/* ══ BREADCRUMB BAR ══ */}
            <div style={{ background: '#f5f6f7', borderBottom: '1px solid #ececec' }}>
                <div className="legal-shell" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', paddingTop: '28px', paddingBottom: '28px' }}>
                    <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#2b2b2b', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
                        {title}
                    </h1>
                    <nav style={{ fontSize: '12.5px', color: '#9a9a9a', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                        <Link href="/" style={{ color: '#9a9a9a', textDecoration: 'none' }}>Home</Link>
                        <span style={{ margin: '0 9px' }}>/</span>
                        <span style={{ color: '#6b6b6b' }}>{title}</span>
                    </nav>
                </div>
            </div>

            {/* ══ BODY: content (left) + products sidebar (right) ══ */}
            <div className="legal-shell" style={{ paddingTop: '52px', paddingBottom: '80px' }}>
                <div className="legal-wrap">
                    {/* MAIN CONTENT */}
                    <main className="legal-main">
                        <h2 className="legal-page-heading">{bigHeading}</h2>
                        <div className="legal-content" dangerouslySetInnerHTML={{ __html: content }} />
                    </main>

                    {/* PRODUCTS SIDEBAR */}
                    <aside className="legal-aside">
                        <div style={{ background: '#f7f7f8', border: '1px solid #ededed', padding: '24px 22px' }}>
                            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#2b2b2b', margin: '0 0 20px' }}>Products</h3>
                            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                                {PRODUCTS.map((p, i) => (
                                    <li key={i} style={{ marginBottom: i < PRODUCTS.length - 1 ? '18px' : 0 }}>
                                        <Link href={PRODUCTS_HREF} className="legal-product">
                                            <span className="legal-product-img">
                                                <Image src={p.image} alt={p.name} fill sizes="64px" style={{ objectFit: 'cover' }} />
                                            </span>
                                            <span style={{ minWidth: 0 }}>
                                                <span style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#2b2b2b', lineHeight: 1.35 }}>{p.name}</span>
                                                <span style={{ display: 'block', fontSize: '14px', color: '#8a8a8a', marginTop: '4px' }}>{p.price}</span>
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </aside>
                </div>
            </div>

            <style>{`
                .legal-shell { max-width: 1200px; margin: 0 auto; padding-left: 24px; padding-right: 24px; }
                .legal-wrap { display: grid; grid-template-columns: minmax(0, 1fr) 300px; gap: 50px; align-items: start; }
                .legal-page-heading { font-size: clamp(26px, 1.4rem + 1.6vw, 40px); font-weight: 800; color: #2b2b2b; letter-spacing: -0.6px; line-height: 1.15; margin: 0 0 26px; }
                .legal-product { display: flex; gap: 14px; align-items: center; text-decoration: none; }
                .legal-product-img { position: relative; width: 64px; height: 64px; flex-shrink: 0; background: #fff; overflow: hidden; }
                .legal-product:hover span span:first-child { color: var(--color-primary); }

                .legal-content h2 { font-size: 22px; font-weight: 800; color: #2b2b2b; margin: 34px 0 14px; letter-spacing: -0.3px; }
                .legal-content h2:first-child { margin-top: 4px; }
                .legal-content h3 { font-size: 16px; font-weight: 700; color: #333; margin: 22px 0 8px; }
                .legal-content p { font-size: 15px; line-height: 1.85; color: #5f6368; margin-bottom: 15px; }
                .legal-content ul, .legal-content ol { padding-left: 22px; margin: 0 0 16px; }
                .legal-content li { font-size: 15px; line-height: 1.8; color: #5f6368; margin-bottom: 11px; }
                .legal-content li::marker { color: #c7c7c7; }
                .legal-content ul ul { margin: 9px 0 2px; }
                .legal-content strong { color: #2b2b2b; font-weight: 700; }
                .legal-content a { color: var(--color-primary); font-weight: 600; text-decoration: underline; text-underline-offset: 2px; }
                .legal-content a:hover { opacity: 0.85; }
                .legal-content blockquote { border-left: 3px solid var(--color-primary); padding: 10px 18px; background: var(--color-primary-surface); margin: 18px 0; color: #444; }
                .legal-content table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px; }
                .legal-content th, .legal-content td { padding: 10px 14px; border: 1px solid #eee; text-align: left; }
                .legal-content th { background: #f8f9fa; font-weight: 700; color: #333; }

                @media (max-width: 900px) {
                    .legal-wrap { grid-template-columns: 1fr; gap: 44px; }
                    .legal-page-heading { font-size: 26px; }
                }
            `}</style>
        </div>
    );
};

export default LegalPageLayout;
