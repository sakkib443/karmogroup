"use client";

/**
 * The "নির্দেশনা" button on a menu page: opens a panel from the right with what the page
 * does, what it needs and how to use it. The words live in guides.ts, one entry per page.
 */
import React, { useEffect, useState } from 'react';
import { LuBookOpen, LuX } from 'react-icons/lu';
import { GUIDES, type Guide, type GuideKey } from './guides';
import { cx } from './ui';

const TONE = {
    info: 'border-gray-200 bg-white',
    need: 'border-amber-200 bg-amber-50',
    no: 'border-red-200 bg-red-50',
} as const;

export default function PageGuide({ page }: { page: GuideKey }) {
    const [open, setOpen] = useState(false);
    const guide: Guide = GUIDES[page];

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open]);

    return (
        <>
            <button type="button" onClick={() => setOpen(true)}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50">
                <LuBookOpen size={16} className="text-[var(--color-primary)]" /> নির্দেশনা
            </button>

            {open && (
                <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-label={guide.title}>
                    <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
                    <aside className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-gray-50 shadow-2xl">
                        <div className="flex items-start justify-between gap-3 border-b border-gray-200 bg-white px-5 py-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--color-primary)]">নির্দেশনা</p>
                                <h2 className="mt-0.5 text-lg font-semibold text-gray-900">{guide.title}</h2>
                                {guide.intro && <p className="mt-1 text-sm text-gray-500">{guide.intro}</p>}
                            </div>
                            <button type="button" onClick={() => setOpen(false)} aria-label="বন্ধ করুন"
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100">
                                <LuX size={18} />
                            </button>
                        </div>
                        <div className="flex-1 space-y-3 overflow-y-auto p-5">
                            {guide.sections.map((s) => (
                                <section key={s.title} className={cx('rounded-2xl border p-4', TONE[s.tone || 'info'])}>
                                    <h3 className="mb-2 text-sm font-semibold text-gray-900">{s.title}</h3>
                                    {s.steps ? (
                                        <ol className="list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-gray-700">
                                            {s.items.map((x) => <li key={x}>{x}</li>)}
                                        </ol>
                                    ) : (
                                        <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-gray-700">
                                            {s.items.map((x) => <li key={x}>{x}</li>)}
                                        </ul>
                                    )}
                                </section>
                            ))}
                        </div>
                    </aside>
                </div>
            )}
        </>
    );
}
