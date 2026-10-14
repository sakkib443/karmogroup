"use client";

/**
 * Admin → Site content: every page of the website that can be edited, with whether
 * it has unpublished changes. Each opens in the editor with a live preview.
 */
import Link from 'next/link';
import { LuArrowRight, LuSlidersHorizontal } from 'react-icons/lu';
import { useGetCmsPagesQuery } from '@/redux/api/cmsApi';
import { CMS_PAGES } from '@/cms/pages';
import { PageHeader, Badge } from '@/components/admin/ui';

const when = (d?: string) => (d ? new Date(d).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' }) : '');

export default function SiteContentHub() {
    const { data } = useGetCmsPagesQuery();
    const status = new Map((data?.data || []).map((p) => [p.page, p]));

    return (
        <div>
            <PageHeader
                title="Site content"
                subtitle="Change the website's words, pictures, videos and overlays — with a live preview. Nothing goes live until you publish."
            />

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {CMS_PAGES.map((p) => {
                    const s = status.get(p.id);
                    return (
                        <Link key={p.id} href={`/dashboard/admin/site-content/${p.id}`}
                            className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-gray-300 hover:shadow-sm">
                            <div className="flex items-start justify-between gap-3">
                                <h2 className="text-[17px] font-semibold text-gray-900">{p.label}</h2>
                                {s?.hasDraft ? <Badge tone="amber">Unpublished changes</Badge> : s?.publishedAt ? <Badge tone="green">Live</Badge> : <Badge>Design content</Badge>}
                            </div>
                            <p className="mt-1.5 flex-1 text-sm text-gray-500">{p.description}</p>
                            <p className="mt-4 text-xs text-gray-400">
                                {p.sections.length} sections{p.path && p.id !== 'global' ? ` · ${p.path}` : ''}
                                {s?.publishedAt ? ` · published ${when(s.publishedAt)}` : ''}
                            </p>
                            <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-primary)]">
                                Edit page <LuArrowRight size={15} className="transition group-hover:translate-x-0.5" />
                            </span>
                        </Link>
                    );
                })}

                <Link href="/dashboard/admin/site-content/settings"
                    className="group flex flex-col rounded-2xl border border-dashed border-gray-300 bg-white p-5 transition hover:border-gray-400">
                    <h2 className="flex items-center gap-2 text-[17px] font-semibold text-gray-900"><LuSlidersHorizontal size={17} /> More settings</h2>
                    <p className="mt-1.5 flex-1 text-sm text-gray-500">Legal pages (privacy, terms…), the floating chat buttons and older store texts.</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                        Open <LuArrowRight size={15} />
                    </span>
                </Link>
            </div>
        </div>
    );
}
