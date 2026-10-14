/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

/**
 * Admin → Site content → <page>. Left: the page's sections and their fields. Right:
 * the real page in an <iframe> that updates as you type (postMessage to the page's
 * <CmsScope>, see src/cms/CmsProvider.jsx).
 *
 * Edits save themselves as a DRAFT a moment after you stop typing — the live site does
 * not change. "Publish" makes the draft live; the last ten published versions can be
 * brought back from History.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import {
    LuChevronLeft, LuMonitor, LuTablet, LuSmartphone, LuExternalLink, LuRefreshCw, LuHistory, LuEye, LuEyeOff,
    LuRotateCcw, LuChevronDown, LuCheck, LuCloudUpload, LuPencil,
} from 'react-icons/lu';
import {
    useGetCmsPageQuery, useSaveCmsDraftMutation, usePublishCmsPageMutation, useDiscardCmsDraftMutation, useRestoreCmsVersionMutation,
} from '@/redux/api/cmsApi';
import { cmsPage } from '@/cms/pages';
import { deepMerge } from '@/cms/core';
import { Btn, cx } from '@/components/admin/ui';
import { FieldsForm, type FieldDef } from './Fields';

type Section = { key: string; label: string; description?: string; fields: FieldDef[]; defaults: Record<string, any> };
type Overrides = Record<string, Record<string, any>>;

const DEVICES = {
    desktop: { width: 1440, icon: LuMonitor, label: 'Desktop' },
    tablet: { width: 834, icon: LuTablet, label: 'Tablet' },
    mobile: { width: 390, icon: LuSmartphone, label: 'Mobile' },
} as const;
type Device = keyof typeof DEVICES;

const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v ?? {}));
const same = (a: unknown, b: unknown) => JSON.stringify(a ?? {}) === JSON.stringify(b ?? {});
const when = (d?: string) => (d ? new Date(d).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }) : '');
const apiError = (e: unknown, fallback: string) => (e as { data?: { message?: string } })?.data?.message || fallback;

/** Only the top-level fields that differ from the design are kept. */
function diffSection(section: Section, value: Record<string, any>) {
    const out: Record<string, any> = {};
    for (const k of Object.keys(value)) {
        if (k === 'hidden' && !value.hidden) continue;
        if (!same(value[k], section.defaults[k])) out[k] = value[k];
    }
    return out;
}

export default function PageEditor({ pageId }: { pageId: string }) {
    const page = cmsPage(pageId);
    const sections = (page?.sections || []) as Section[];
    const { data, isLoading, isError } = useGetCmsPageQuery(pageId, { refetchOnMountOrArgChange: true });
    const [saveDraft] = useSaveCmsDraftMutation();
    const [publishPage, { isLoading: publishing }] = usePublishCmsPageMutation();
    const [discardDraft] = useDiscardCmsDraftMutation();
    const [restoreVersion] = useRestoreCmsVersionMutation();

    const [overrides, setOverrides] = useState<Overrides>({});
    const [published, setPublished] = useState<Overrides>({});
    const [versions, setVersions] = useState<any[]>([]);
    const [meta, setMeta] = useState<{ publishedAt?: string; publishedBy?: string }>({});
    const [loadedFor, setLoadedFor] = useState('');
    const [saveState, setSaveState] = useState<'idle' | 'dirty' | 'saving' | 'saved' | 'error'>('idle');
    const [savedAt, setSavedAt] = useState<string>('');
    const [openKey, setOpenKey] = useState<string | null>(null);
    const [device, setDevice] = useState<Device>('desktop');
    const [mobileView, setMobileView] = useState<'edit' | 'preview'>('edit');
    const [historyOpen, setHistoryOpen] = useState(false);
    const [frameKey, setFrameKey] = useState(0);

    // Load the saved draft (or what is live) once per page — the editor owns it after that.
    const d = data?.data;
    if (d && loadedFor !== pageId) {
        setLoadedFor(pageId);
        setOverrides(clone((d.draft ?? d.published ?? {}) as Overrides));
        setPublished(clone((d.published ?? {}) as Overrides));
        setVersions(d.versions || []);
        setMeta({ publishedAt: d.publishedAt, publishedBy: d.publishedBy?.name });
        setSaveState(d.hasDraft ? 'saved' : 'idle');
        setSavedAt(d.draftAt || '');
    }

    /* ── Autosave: a draft, a moment after the last change ── */
    const pendingRef = useRef(false);
    const latest = useRef(overrides);
    useEffect(() => { latest.current = overrides; }, [overrides]);
    const [tick, setTick] = useState(0);

    const change = useCallback((next: Overrides) => {
        setOverrides(next);
        pendingRef.current = true;
        setSaveState('dirty');
        setTick((t) => t + 1);
    }, []);

    useEffect(() => {
        if (!pendingRef.current) return;
        const t = setTimeout(async () => {
            pendingRef.current = false;
            setSaveState('saving');
            try {
                await saveDraft({ page: pageId, content: latest.current }).unwrap();
                setSaveState('saved');
                setSavedAt(new Date().toISOString());
            } catch (e) {
                setSaveState('error');
                toast.error(apiError(e, 'Could not save the draft'));
            }
        }, 1200);
        return () => clearTimeout(t);
    }, [tick, pageId, saveDraft]);

    // Leaving with an edit not yet saved? Ask first.
    useEffect(() => {
        const warn = (e: BeforeUnloadEvent) => { if (pendingRef.current) { e.preventDefault(); e.returnValue = ''; } };
        window.addEventListener('beforeunload', warn);
        return () => window.removeEventListener('beforeunload', warn);
    }, []);

    /* ── Live preview ── */
    const frame = useRef<HTMLIFrameElement>(null);
    const post = useCallback((msg: object) => {
        frame.current?.contentWindow?.postMessage(msg, window.location.origin);
    }, []);
    useEffect(() => {
        const onMessage = (e: MessageEvent) => {
            if (e.origin !== window.location.origin) return;
            if (e.data?.type === 'karmo-cms:ready') post({ type: 'karmo-cms:content', page: pageId, content: latest.current });
        };
        window.addEventListener('message', onMessage);
        return () => window.removeEventListener('message', onMessage);
    }, [pageId, post]);
    useEffect(() => {
        const t = setTimeout(() => post({ type: 'karmo-cms:content', page: pageId, content: overrides }), 120);
        return () => clearTimeout(t);
    }, [overrides, pageId, post]);

    const stage = useRef<HTMLDivElement>(null);
    const [box, setBox] = useState({ w: 0, h: 0 });
    useEffect(() => {
        const el = stage.current;
        if (!el) return;
        const ro = new ResizeObserver(([entry]) => setBox({ w: entry.contentRect.width, h: entry.contentRect.height }));
        ro.observe(el);
        return () => ro.disconnect();
    }, []);
    const devWidth = DEVICES[device].width;
    const scale = box.w ? Math.min(1, box.w / devWidth) : 1;

    /* ── Sections ── */
    const values = useMemo(() => {
        const out: Record<string, any> = {};
        for (const s of sections) out[s.key] = deepMerge(s.defaults, overrides[s.key]);
        return out;
    }, [sections, overrides]);

    const setSection = (s: Section, value: Record<string, any>) => {
        const diff = diffSection(s, value);
        const next = { ...overrides };
        if (Object.keys(diff).length) next[s.key] = diff;
        else delete next[s.key];
        change(next);
    };

    const openSection = (key: string) => {
        const next = openKey === key ? null : key;
        setOpenKey(next);
        if (next) post({ type: 'karmo-cms:focus', section: next });
    };

    /* ── Publish, discard, history ── */
    const unpublished = !same(overrides, published);

    const publish = async () => {
        if (!window.confirm(`Publish the ${page?.label} page? Visitors will see these changes straight away.`)) return;
        try {
            const res = await publishPage({ page: pageId, content: overrides }).unwrap();
            pendingRef.current = false;
            setPublished(clone(overrides));
            setVersions(res.data?.versions || []);
            setMeta({ publishedAt: res.data?.publishedAt, publishedBy: res.data?.publishedBy?.name });
            setSaveState('idle');
            let token = '';
            try { token = localStorage.getItem('token') || ''; } catch { /* none */ }
            fetch('/api/cms-revalidate', {
                method: 'POST',
                headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
                body: JSON.stringify({ page: pageId }),
            }).catch(() => {});
            toast.success('Published — the live site shows it now');
        } catch (e) {
            toast.error(apiError(e, 'Could not publish'));
        }
    };

    const discard = async () => {
        if (!window.confirm('Throw away every change since the last publish?')) return;
        try {
            await discardDraft(pageId).unwrap();
            pendingRef.current = false;
            setOverrides(clone(published));
            setSaveState('idle');
            toast.success('Back to the published page');
        } catch (e) {
            toast.error(apiError(e, 'Could not discard'));
        }
    };

    const restore = async (index: number) => {
        if (!window.confirm('Load this older version? It becomes a draft — publish it to make it live.')) return;
        try {
            const res = await restoreVersion({ page: pageId, index }).unwrap();
            pendingRef.current = false;
            setOverrides(clone((res.data?.draft || {}) as Overrides));
            setSaveState('saved');
            setSavedAt(new Date().toISOString());
            setHistoryOpen(false);
            toast.success('Older version loaded as a draft');
        } catch (e) {
            toast.error(apiError(e, 'Could not load that version'));
        }
    };

    if (!page) return <p className="p-8 text-center text-gray-500">This page cannot be edited here yet.</p>;

    const status =
        saveState === 'saving' ? { text: 'Saving draft…', tone: 'text-gray-500' }
            : saveState === 'dirty' ? { text: 'Unsaved changes', tone: 'text-amber-600' }
                : saveState === 'error' ? { text: 'Draft not saved', tone: 'text-red-600' }
                    : unpublished ? { text: `Draft saved${savedAt ? ` · ${when(savedAt)}` : ''} — not live yet`, tone: 'text-amber-600' }
                        : { text: meta.publishedAt ? `Live · published ${when(meta.publishedAt)}${meta.publishedBy ? ` by ${meta.publishedBy}` : ''}` : 'Showing the design’s own content', tone: 'text-emerald-700' };

    return (
        <div className="flex h-[calc(100vh-7.5rem)] min-h-[620px] flex-col">
            {/* Top bar */}
            <div className="mb-3 flex flex-wrap items-center gap-3">
                <Link href="/dashboard/admin/site-content" className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50" aria-label="All pages">
                    <LuChevronLeft size={18} />
                </Link>
                <div className="min-w-0">
                    <h1 className="truncate text-lg font-semibold text-gray-900">{page.label}</h1>
                    <p className={cx('truncate text-xs', status.tone)}>{status.text}</p>
                </div>

                <div className="ml-auto flex flex-wrap items-center gap-2">
                    <div className="hidden rounded-lg bg-gray-100 p-0.5 md:inline-flex">
                        {(Object.keys(DEVICES) as Device[]).map((k) => {
                            const D = DEVICES[k];
                            return (
                                <button key={k} type="button" onClick={() => setDevice(k)} title={D.label}
                                    className={cx('inline-flex h-8 w-9 items-center justify-center rounded-md transition', device === k ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-800')}>
                                    <D.icon size={16} />
                                </button>
                            );
                        })}
                    </div>
                    <button type="button" onClick={() => setFrameKey((k) => k + 1)} title="Reload preview" className="hidden h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 md:inline-flex">
                        <LuRefreshCw size={15} />
                    </button>
                    <a href={page.path} target="_blank" rel="noreferrer" title="Open the live page" className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
                        <LuExternalLink size={15} />
                    </a>

                    <div className="relative">
                        <button type="button" onClick={() => setHistoryOpen((o) => !o)} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-700 hover:bg-gray-50">
                            <LuHistory size={15} /> History <LuChevronDown size={13} />
                        </button>
                        {historyOpen && (
                            <div className="absolute right-0 top-11 z-30 w-72 rounded-xl border border-gray-200 bg-white p-2 shadow-xl">
                                <p className="px-2 pb-2 pt-1 text-xs text-gray-500">Earlier published versions</p>
                                {versions.length === 0 ? <p className="px-2 py-3 text-sm text-gray-400">None yet — they appear after you publish twice.</p> : versions.map((v) => (
                                    <button key={v.index} type="button" onClick={() => restore(v.index)} className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-sm hover:bg-gray-50">
                                        <span>{when(v.at)}<span className="block text-xs text-gray-400">{v.by?.name || '—'}</span></span>
                                        <span className="text-xs font-medium text-[var(--color-primary)]">Load</span>
                                    </button>
                                ))}
                                {unpublished ? (
                                    <button type="button" onClick={() => { setHistoryOpen(false); discard(); }} className="mt-1 flex w-full items-center gap-2 rounded-lg border-t border-gray-100 px-2 pt-2.5 pb-2 text-left text-sm text-red-600 hover:bg-red-50">
                                        <LuRotateCcw size={14} /> Discard changes since last publish
                                    </button>
                                ) : null}
                            </div>
                        )}
                    </div>

                    <Btn variant="primary" icon={<LuCloudUpload size={15} />} onClick={publish} disabled={publishing || (!unpublished && saveState !== 'dirty')}>
                        {publishing ? 'Publishing…' : 'Publish'}
                    </Btn>
                </div>
            </div>

            {/* Phones: switch between the form and the preview */}
            <div className="mb-3 inline-flex self-start rounded-lg bg-gray-100 p-0.5 lg:hidden">
                {(['edit', 'preview'] as const).map((v) => (
                    <button key={v} type="button" onClick={() => setMobileView(v)}
                        className={cx('inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium', mobileView === v ? 'bg-white shadow-sm' : 'text-gray-500')}>
                        {v === 'edit' ? <><LuPencil size={14} /> Edit</> : <><LuEye size={14} /> Preview</>}
                    </button>
                ))}
            </div>

            <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[420px_minmax(0,1fr)]">
                {/* Sections */}
                <div className={cx('min-h-0 overflow-y-auto pr-1', mobileView === 'preview' && 'hidden lg:block')}>
                    {isLoading ? <p className="p-6 text-center text-sm text-gray-400">Loading…</p> : isError ? (
                        <p className="p-6 text-center text-sm text-red-600">Could not load this page. Is the server running?</p>
                    ) : (
                        <div className="space-y-2.5 pb-6">
                            {sections.map((s) => {
                                const v = values[s.key] || {};
                                const edited = Boolean(overrides[s.key] && Object.keys(overrides[s.key]).some((k) => k !== 'hidden'));
                                const open = openKey === s.key;
                                return (
                                    <div key={s.key} className={cx('rounded-2xl border bg-white transition', open ? 'border-gray-300 shadow-sm' : 'border-gray-200')}>
                                        <div className="flex items-center gap-2 px-4 py-3">
                                            <button type="button" onClick={() => openSection(s.key)} className="min-w-0 flex-1 text-left">
                                                <span className={cx('flex items-center gap-2 text-[15px] font-semibold', v.hidden ? 'text-gray-400' : 'text-gray-900')}>
                                                    {s.label}
                                                    {edited ? <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">Edited</span> : null}
                                                    {v.hidden ? <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-500">Hidden</span> : null}
                                                </span>
                                                {s.description ? <span className="mt-0.5 block truncate text-xs text-gray-500">{s.description}</span> : null}
                                            </button>
                                            <button type="button" title={v.hidden ? 'Show this section' : 'Hide this section'}
                                                onClick={() => setSection(s, { ...v, hidden: !v.hidden })}
                                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700">
                                                {v.hidden ? <LuEyeOff size={16} /> : <LuEye size={16} />}
                                            </button>
                                            <button type="button" onClick={() => openSection(s.key)} className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100">
                                                <LuChevronDown size={16} className={cx('transition', open && 'rotate-180')} />
                                            </button>
                                        </div>
                                        {open ? (
                                            <div className="border-t border-gray-100 px-4 pb-4 pt-4">
                                                <FieldsForm fields={s.fields} value={v} defaults={s.defaults} onChange={(n) => setSection(s, n)} />
                                                {edited ? (
                                                    <button type="button" onClick={() => { if (window.confirm(`Put “${s.label}” back to the design's own content?`)) { const next = { ...overrides }; delete next[s.key]; change(next); } }}
                                                        className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-red-600">
                                                        <LuRotateCcw size={13} /> Reset this whole section
                                                    </button>
                                                ) : null}
                                            </div>
                                        ) : null}
                                    </div>
                                );
                            })}
                            <p className="flex items-center gap-1.5 px-1 pt-2 text-xs text-gray-400">
                                <LuCheck size={13} /> Changes save as a draft by themselves. Nothing changes on the live site until you press Publish.
                            </p>
                        </div>
                    )}
                </div>

                {/* Preview */}
                <div className={cx('min-h-0 overflow-hidden rounded-2xl border border-gray-200 bg-[#e9ebee]', mobileView === 'edit' && 'hidden lg:block')}>
                    <div ref={stage} className="relative h-full w-full overflow-hidden">
                        {box.w > 0 ? (
                            <div className="absolute top-0" style={{ left: Math.max(0, (box.w - devWidth * scale) / 2), width: devWidth * scale, height: box.h }}>
                                <iframe
                                    key={`${pageId}-${frameKey}`}
                                    ref={frame}
                                    title={`${page.label} preview`}
                                    src={`${page.path}${page.path.includes('?') ? '&' : '?'}cmsPreview=1`}
                                    className="origin-top-left border-0 bg-white"
                                    style={{ width: devWidth, height: box.h / scale, transform: `scale(${scale})` }}
                                />
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
}
