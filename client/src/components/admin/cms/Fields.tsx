/* eslint-disable @typescript-eslint/no-explicit-any, @next/next/no-img-element */
"use client";

/**
 * The editor's form fields for Site content (types in src/cms/fields.js). Every field
 * takes the current value and hands back a new one — the page editor keeps the state.
 */
import React, { useRef, useState } from 'react';
import {
    LuChevronDown, LuChevronUp, LuCopy, LuTrash2, LuPlus, LuImage, LuVideo, LuRotateCcw, LuCrosshair,
} from 'react-icons/lu';
import { resolveMedia, rgba } from '@/cms/core';
import { cx } from '@/components/admin/ui';
import MediaLibrary from './MediaLibrary';
import type { MediaItem } from '@/redux/api/cmsApi';

export type FieldDef = {
    type: string; key: string; label: string; help?: string; size?: boolean;
    options?: { value: string; label: string }[]; min?: number; max?: number; step?: number; unit?: string;
    fields?: FieldDef[]; itemLabel?: (item: any, i: number) => string; fixed?: boolean;
};

const INPUT = 'h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10';
const LABEL = 'mb-1.5 flex items-center justify-between gap-2 text-[13px] font-medium text-gray-700';
const SMALL_BTN = 'inline-flex h-8 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50';

const src = (v?: string) => (v ? (resolveMedia(v) as string) : '');
const clone = (v: any) => JSON.parse(JSON.stringify(v ?? null));

function Slider({ value, onChange, min, max, step = 1, unit = '', dflt }: {
    value: number; onChange: (v: number) => void; min: number; max: number; step?: number; unit?: string; dflt?: number;
}) {
    const v = Number.isFinite(Number(value)) ? Number(value) : (dflt ?? min);
    return (
        <div className="flex items-center gap-3">
            <input type="range" min={min} max={max} step={step} value={v} onChange={(e) => onChange(Number(e.target.value))}
                className="h-1.5 flex-1 cursor-pointer accent-[var(--color-primary)]" />
            <span className="w-14 text-right text-xs tabular-nums text-gray-600">{v}{unit}</span>
            {dflt != null && v !== dflt ? (
                <button type="button" onClick={() => onChange(dflt)} title="Back to the design's value" className="text-gray-400 hover:text-gray-700"><LuRotateCcw size={13} /></button>
            ) : <span className="w-[13px]" />}
        </div>
    );
}

/* ─── Text ──────────────────────────────────────────────── */

function TextField({ def, value, onChange, sizeValue, onSize }: { def: FieldDef; value: any; onChange: (v: any) => void; sizeValue?: number; onSize?: (v: number) => void }) {
    const multi = def.type === 'textarea';
    return (
        <div>
            {multi ? (
                <textarea className={cx(INPUT, 'h-auto min-h-[76px] py-2 leading-relaxed')} rows={3} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
            ) : (
                <input className={INPUT} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
            )}
            {def.size && onSize ? (
                <div className="mt-2">
                    <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-gray-400">Text size</p>
                    <Slider value={sizeValue ?? 100} onChange={onSize} min={50} max={200} step={5} unit="%" dflt={100} />
                </div>
            ) : null}
        </div>
    );
}

/* ─── Image ─────────────────────────────────────────────── */

function MediaPicker({ kind, onPick, children }: { kind: 'image' | 'video'; onPick: (m: MediaItem) => void; children: (open: () => void) => React.ReactNode }) {
    const [open, setOpen] = useState(false);
    return (
        <>
            {children(() => setOpen(true))}
            {open && <MediaLibrary open kind={kind} onClose={() => setOpen(false)} onPick={onPick} />}
        </>
    );
}

function ImageField({ value, onChange, compact = false }: { value: any; onChange: (v: any) => void; compact?: boolean }) {
    const v = value || {};
    const frame = useRef<HTMLDivElement>(null);
    const [more, setMore] = useState(false);
    const x = Number.isFinite(v.x) ? v.x : 50;
    const y = Number.isFinite(v.y) ? v.y : 50;
    const zoom = Number.isFinite(v.zoom) ? v.zoom : 100;
    const set = (patch: any) => onChange({ ...v, ...patch });

    const pickFocus = (e: React.MouseEvent) => {
        const r = frame.current?.getBoundingClientRect();
        if (!r) return;
        set({ x: Math.round(((e.clientX - r.left) / r.width) * 100), y: Math.round(((e.clientY - r.top) / r.height) * 100) });
    };

    return (
        <div className="rounded-xl border border-gray-200 bg-gray-50/60 p-2.5">
            <div className="flex gap-3">
                <div ref={frame} onClick={v.src ? pickFocus : undefined} title={v.src ? 'Click the part of the picture that must always show' : undefined}
                    className={cx('relative shrink-0 overflow-hidden rounded-lg bg-[repeating-conic-gradient(#eef0f3_0%_25%,#fff_0%_50%)] bg-[length:14px_14px]',
                        compact ? 'h-16 w-24' : 'h-24 w-36', v.src && 'cursor-crosshair')}>
                    {v.src ? (
                        <>
                            <img src={src(v.src)} alt="" className="h-full w-full"
                                style={{ objectFit: v.fit === 'contain' ? 'contain' : 'cover', objectPosition: `${x}% ${y}%`, transform: zoom !== 100 ? `scale(${zoom / 100})` : undefined, transformOrigin: `${x}% ${y}%` }} />
                            <span className="pointer-events-none absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[var(--color-primary)] shadow"
                                style={{ left: `${x}%`, top: `${y}%` }} />
                        </>
                    ) : (
                        <span className="flex h-full w-full items-center justify-center text-gray-300"><LuImage size={22} /></span>
                    )}
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
                    <div className="flex flex-wrap gap-1.5">
                        <MediaPicker kind="image" onPick={(m) => set({ src: m.url, width: m.width || v.width, height: m.height || v.height, alt: v.alt || '' })}>
                            {(open) => <button type="button" onClick={open} className={SMALL_BTN}><LuImage size={13} /> {v.src ? 'Change' : 'Choose picture'}</button>}
                        </MediaPicker>
                        {v.src ? <button type="button" onClick={() => set({ src: '' })} className={cx(SMALL_BTN, 'text-red-600')}><LuTrash2 size={13} /> Remove</button> : null}
                    </div>
                    {v.src ? (
                        <div className="flex flex-wrap items-center gap-1.5">
                            {(['cover', 'contain'] as const).map((fit) => (
                                <button key={fit} type="button" onClick={() => set({ fit })}
                                    className={cx('rounded-md px-2 py-1 text-[11px] font-medium transition', (v.fit || 'cover') === fit ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50')}>
                                    {fit === 'cover' ? 'Fill the frame' : 'Show whole picture'}
                                </button>
                            ))}
                            <button type="button" onClick={() => setMore((m) => !m)} className="ml-auto text-[11px] font-medium text-gray-500 hover:text-gray-800">
                                {more ? 'Less' : 'Size & position'}
                            </button>
                        </div>
                    ) : null}
                </div>
            </div>
            {v.src && more ? (
                <div className="mt-3 space-y-2.5 border-t border-gray-200 pt-3">
                    <div>
                        <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-gray-400">Zoom (bigger / smaller)</p>
                        <Slider value={zoom} onChange={(n) => set({ zoom: n })} min={50} max={250} step={1} unit="%" dflt={100} />
                    </div>
                    <div>
                        <p className="mb-1 flex items-center gap-1 text-[11px] font-medium uppercase tracking-wide text-gray-400"><LuCrosshair size={11} /> Focus — left / right</p>
                        <Slider value={x} onChange={(n) => set({ x: n })} min={0} max={100} unit="%" dflt={50} />
                    </div>
                    <div>
                        <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-gray-400">Focus — top / bottom</p>
                        <Slider value={y} onChange={(n) => set({ y: n })} min={0} max={100} unit="%" dflt={50} />
                    </div>
                    <div>
                        <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-gray-400">Description (for Google & screen readers)</p>
                        <input className={INPUT} value={v.alt || ''} onChange={(e) => set({ alt: e.target.value })} />
                    </div>
                </div>
            ) : null}
        </div>
    );
}

/* ─── Video ─────────────────────────────────────────────── */

function VideoField({ value, onChange, rate = false }: { value: any; onChange: (v: any) => void; rate?: boolean }) {
    const v = value || {};
    const set = (patch: any) => onChange({ ...v, ...patch });
    return (
        <div className="rounded-xl border border-gray-200 bg-gray-50/60 p-2.5">
            <div className="flex gap-3">
                <div className="relative h-24 w-36 shrink-0 overflow-hidden rounded-lg bg-gray-900">
                    {v.src ? <video key={v.src} src={src(v.src)} poster={v.poster ? src(v.poster) : undefined} muted preload="metadata" className="h-full w-full object-cover" />
                        : <span className="flex h-full w-full items-center justify-center text-gray-500"><LuVideo size={22} /></span>}
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <div className="flex flex-wrap gap-1.5">
                        <MediaPicker kind="video" onPick={(m) => set({ src: m.url })}>
                            {(open) => <button type="button" onClick={open} className={SMALL_BTN}><LuVideo size={13} /> {v.src ? 'Change video' : 'Choose video'}</button>}
                        </MediaPicker>
                        {v.src ? <button type="button" onClick={() => set({ src: '' })} className={cx(SMALL_BTN, 'text-red-600')}><LuTrash2 size={13} /> Remove</button> : null}
                    </div>
                    <MediaPicker kind="image" onPick={(m) => set({ poster: m.url })}>
                        {(open) => (
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <button type="button" onClick={open} className={SMALL_BTN}><LuImage size={13} /> {v.poster ? 'Change cover picture' : 'Cover picture'}</button>
                                {v.poster ? <button type="button" onClick={() => set({ poster: '' })} className="text-gray-400 hover:text-red-600"><LuTrash2 size={13} /></button> : null}
                            </div>
                        )}
                    </MediaPicker>
                    {rate ? (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            Speed
                            {[0.75, 1, 1.25, 1.5].map((r) => (
                                <button key={r} type="button" onClick={() => set({ rate: r })}
                                    className={cx('rounded-md px-2 py-0.5 text-[11px] font-medium', (Number(v.rate) || 1) === r ? 'bg-gray-900 text-white' : 'bg-white ring-1 ring-gray-200')}>
                                    {r}×
                                </button>
                            ))}
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

/** Image or video (hero slides). */
function MediaField({ value, onChange }: { value: any; onChange: (v: any) => void }) {
    const v = value || {};
    const type = v.type === 'video' ? 'video' : 'image';
    return (
        <div className="space-y-2">
            <div className="inline-flex rounded-lg bg-gray-100 p-0.5">
                {(['image', 'video'] as const).map((t) => (
                    <button key={t} type="button" onClick={() => onChange({ ...v, type: t })}
                        className={cx('inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition', type === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500')}>
                        {t === 'image' ? <><LuImage size={13} /> Picture</> : <><LuVideo size={13} /> Video</>}
                    </button>
                ))}
            </div>
            {type === 'video' ? <VideoField value={v} onChange={(n) => onChange({ ...n, type: 'video' })} rate /> : <ImageField value={v} onChange={(n) => onChange({ ...n, type: 'image' })} />}
        </div>
    );
}

/* ─── Overlay, link, choice ─────────────────────────────── */

function OverlayField({ value, onChange }: { value: any; onChange: (v: any) => void }) {
    const v = value || { color: '#000000', opacity: 0 };
    return (
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50/60 p-2.5">
            <label className="relative h-9 w-9 shrink-0 cursor-pointer overflow-hidden rounded-lg ring-1 ring-gray-200" title="Colour"
                style={{ background: `linear-gradient(${rgba(v.color, v.opacity)}, ${rgba(v.color, v.opacity)}), repeating-conic-gradient(#ddd 0% 25%, #fff 0% 50%) 0 0 / 10px 10px` }}>
                <input type="color" value={v.color || '#000000'} onChange={(e) => onChange({ ...v, color: e.target.value })} className="absolute inset-0 cursor-pointer opacity-0" />
            </label>
            <div className="flex-1">
                <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-gray-400">How dark</p>
                <Slider value={Number(v.opacity) || 0} onChange={(n) => onChange({ ...v, opacity: n })} min={0} max={95} unit="%" />
            </div>
        </div>
    );
}

function LinkField({ value, onChange }: { value: any; onChange: (v: any) => void }) {
    const v = value || {};
    return (
        <div className="grid grid-cols-[1fr_1fr] gap-2">
            <input className={INPUT} placeholder="Text (empty = hidden)" value={v.label || ''} onChange={(e) => onChange({ ...v, label: e.target.value })} />
            <input className={INPUT} placeholder="/page or https://…" value={v.href || ''} onChange={(e) => onChange({ ...v, href: e.target.value })} />
        </div>
    );
}

function SelectField({ def, value, onChange }: { def: FieldDef; value: any; onChange: (v: any) => void }) {
    return (
        <div className="inline-flex flex-wrap rounded-lg bg-gray-100 p-0.5">
            {(def.options || []).map((o) => (
                <button key={o.value} type="button" onClick={() => onChange(o.value)}
                    className={cx('rounded-md px-3 py-1 text-xs font-medium transition', value === o.value ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-800')}>
                    {o.label}
                </button>
            ))}
        </div>
    );
}

export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
    return (
        <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className="inline-flex items-center gap-2 text-sm text-gray-700">
            <span className={cx('relative h-5 w-9 shrink-0 rounded-full transition', checked ? 'bg-[var(--color-primary)]' : 'bg-gray-300')}>
                <span className={cx('absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all', checked ? 'left-[18px]' : 'left-0.5')} />
            </span>
            {label}
        </button>
    );
}

/* ─── List & group ──────────────────────────────────────── */

function ListField({ def, value, onChange }: { def: FieldDef; value: any; onChange: (v: any) => void }) {
    const items: any[] = Array.isArray(value) ? value : [];
    const [open, setOpen] = useState<number | null>(items.length === 1 ? 0 : null);
    const set = (next: any[]) => onChange(next);
    const move = (i: number, d: number) => {
        const j = i + d;
        if (j < 0 || j >= items.length) return;
        const next = [...items];
        [next[i], next[j]] = [next[j], next[i]];
        set(next);
        setOpen(j);
    };
    const add = () => {
        const template = clone(items[items.length - 1] ?? {});
        delete template.id;
        set([...items, template]);
        setOpen(items.length);
    };
    const canAdd = !def.fixed && (!def.max || items.length < def.max);

    return (
        <div className="space-y-2">
            {items.map((item, i) => {
                const isOpen = open === i;
                const title = def.itemLabel ? def.itemLabel(item, i) : `Item ${i + 1}`;
                const thumb = item?.image?.src || item?.media?.src || item?.icon?.src || item?.logo?.src;
                return (
                    <div key={i} className={cx('overflow-hidden rounded-xl border bg-white transition', isOpen ? 'border-gray-300 shadow-sm' : 'border-gray-200')}>
                        <div className="flex items-center gap-2 px-2.5 py-2">
                            <button type="button" onClick={() => setOpen(isOpen ? null : i)} className="flex min-w-0 flex-1 items-center gap-2.5 text-left">
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md bg-gray-100 text-[11px] font-semibold text-gray-500">
                                    {thumb && item?.media?.type !== 'video' ? <img src={src(thumb)} alt="" className="h-full w-full object-cover" /> : i + 1}
                                </span>
                                <span className="truncate text-sm font-medium text-gray-800">{title || `Item ${i + 1}`}</span>
                            </button>
                            <div className="flex shrink-0 items-center text-gray-400">
                                <button type="button" title="Move up" onClick={() => move(i, -1)} disabled={i === 0} className="rounded p-1 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-30"><LuChevronUp size={15} /></button>
                                <button type="button" title="Move down" onClick={() => move(i, 1)} disabled={i === items.length - 1} className="rounded p-1 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-30"><LuChevronDown size={15} /></button>
                                {canAdd ? <button type="button" title="Duplicate" onClick={() => { const next = [...items]; const c = clone(item); delete c.id; next.splice(i + 1, 0, c); set(next); setOpen(i + 1); }} className="rounded p-1 hover:bg-gray-100 hover:text-gray-700"><LuCopy size={14} /></button> : null}
                                {!def.fixed ? <button type="button" title="Delete" onClick={() => { if (window.confirm(`Delete “${title}”?`)) { set(items.filter((_, j) => j !== i)); setOpen(null); } }} className="rounded p-1 hover:bg-red-50 hover:text-red-600"><LuTrash2 size={14} /></button> : null}
                            </div>
                        </div>
                        {isOpen ? (
                            <div className="border-t border-gray-100 bg-gray-50/40 px-3 py-3">
                                <FieldsForm fields={def.fields || []} value={item || {}} onChange={(n) => set(items.map((x, j) => (j === i ? n : x)))} />
                            </div>
                        ) : null}
                    </div>
                );
            })}
            {canAdd ? (
                <button type="button" onClick={add} className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-gray-300 py-2.5 text-sm font-medium text-gray-600 transition hover:border-gray-400 hover:bg-gray-50">
                    <LuPlus size={15} /> Add {def.label.toLowerCase().replace(/s$/, '')}
                </button>
            ) : null}
        </div>
    );
}

/* ─── A set of fields ───────────────────────────────────── */

/**
 * Renders `fields` over the object `value`. `defaults` (optional) is what the design
 * had — a field that differs shows a small "reset" link.
 */
export function FieldsForm({ fields, value, onChange, defaults }: {
    fields: FieldDef[]; value: any; onChange: (v: any) => void; defaults?: any;
}) {
    const v = value || {};
    const set = (k: string, val: any) => onChange({ ...v, [k]: val });

    return (
        <div className="space-y-4">
            {fields.map((def) => {
                const val = v[def.key];
                const changed = defaults && JSON.stringify(val) !== JSON.stringify(defaults[def.key]);
                const reset = changed ? (
                    <button type="button" onClick={() => set(def.key, clone(defaults[def.key]))} className="inline-flex items-center gap-1 text-[11px] font-normal text-gray-400 hover:text-gray-700" title="Back to the design's content">
                        <LuRotateCcw size={11} /> Reset
                    </button>
                ) : null;

                if (def.type === 'group') {
                    return (
                        <fieldset key={def.key} className="rounded-xl border border-gray-200 p-3">
                            <legend className="px-1 text-[13px] font-semibold text-gray-800">{def.label}</legend>
                            <FieldsForm fields={def.fields || []} value={val || {}} onChange={(n) => set(def.key, n)} defaults={defaults?.[def.key]} />
                        </fieldset>
                    );
                }

                let input: React.ReactNode = null;
                switch (def.type) {
                    case 'text':
                    case 'textarea':
                        input = <TextField def={def} value={val} onChange={(n) => set(def.key, n)} sizeValue={v[`${def.key}Size`]} onSize={(n) => set(`${def.key}Size`, n)} />;
                        break;
                    case 'image': input = <ImageField value={val} onChange={(n) => set(def.key, n)} />; break;
                    case 'video': input = <VideoField value={val} onChange={(n) => set(def.key, n)} />; break;
                    case 'media': input = <MediaField value={val} onChange={(n) => set(def.key, n)} />; break;
                    case 'overlay': input = <OverlayField value={val} onChange={(n) => set(def.key, n)} />; break;
                    case 'link': input = <LinkField value={val} onChange={(n) => set(def.key, n)} />; break;
                    case 'select': input = <SelectField def={def} value={val} onChange={(n) => set(def.key, n)} />; break;
                    case 'toggle': input = <Switch checked={Boolean(val)} onChange={(n) => set(def.key, n)} />; break;
                    case 'range': input = <Slider value={val} onChange={(n) => set(def.key, n)} min={def.min ?? 0} max={def.max ?? 100} step={def.step} unit={def.unit} dflt={defaults?.[def.key]} />; break;
                    case 'color':
                        input = (
                            <div className="flex items-center gap-2">
                                <input type="color" value={val || '#000000'} onChange={(e) => set(def.key, e.target.value)} className="h-9 w-12 cursor-pointer rounded-lg border border-gray-200" />
                                <input className={cx(INPUT, 'w-32 font-mono')} value={val || ''} onChange={(e) => set(def.key, e.target.value)} />
                            </div>
                        );
                        break;
                    case 'list': input = <ListField def={def} value={val} onChange={(n) => set(def.key, n)} />; break;
                    default: input = <p className="text-xs text-gray-400">Unknown field “{def.type}”</p>;
                }

                return (
                    <div key={def.key}>
                        <div className={LABEL}><span>{def.label}</span>{reset}</div>
                        {input}
                        {def.help ? <p className="mt-1 text-[11px] text-gray-400">{def.help}</p> : null}
                    </div>
                );
            })}
        </div>
    );
}
