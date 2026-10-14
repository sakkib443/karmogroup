"use client";

/**
 * The media library: every picture and video uploaded for Site content. Pick one,
 * upload new ones (drag & drop works), or delete what is no longer used.
 */
import React, { useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { LuCloudUpload, LuTrash2, LuCheck, LuVideo, LuImage } from 'react-icons/lu';
import { useDeleteMediaMutation, useGetMediaQuery, type MediaItem } from '@/redux/api/cmsApi';
import { resolveMedia } from '@/cms/core';
import { Modal, Btn, cx } from '@/components/admin/ui';
import { uploadMedia } from './upload';

type Kind = 'image' | 'video' | 'any';

const kb = (n: number) => (n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);

export default function MediaLibrary({ open, kind = 'image', onClose, onPick }: {
    open: boolean;
    kind?: Kind;
    onClose: () => void;
    onPick: (item: MediaItem) => void;
}) {
    const [tab, setTab] = useState<Kind>(kind);
    const { data, isFetching, refetch } = useGetMediaQuery({ kind: tab === 'any' ? undefined : tab, limit: 120 }, { skip: !open });
    const [deleteMedia] = useDeleteMediaMutation();
    const [uploading, setUploading] = useState<{ name: string; pct: number }[]>([]);
    const [dragging, setDragging] = useState(false);
    const input = useRef<HTMLInputElement>(null);
    const items = data?.data || [];

    const accept = kind === 'video' ? 'video/mp4,video/webm' : kind === 'image' ? 'image/*' : 'image/*,video/mp4,video/webm';

    const upload = async (files: FileList | File[]) => {
        const list = Array.from(files);
        if (!list.length) return;
        setUploading(list.map((f) => ({ name: f.name, pct: 0 })));
        let last: MediaItem | null = null;
        for (let i = 0; i < list.length; i++) {
            try {
                last = await uploadMedia(list[i], (pct) => setUploading((u) => u.map((x, j) => (j === i ? { ...x, pct } : x))));
            } catch (e) {
                toast.error(`${list[i].name}: ${(e as Error).message}`);
            }
        }
        setUploading([]);
        refetch();
        // One file — use it straight away.
        if (list.length === 1 && last) { onPick(last); onClose(); }
        else if (last) toast.success(`${list.length} files uploaded`);
    };

    const remove = async (item: MediaItem) => {
        if (!window.confirm(`Delete “${item.name}” from the library?\n\nIf a page still uses it, that picture will disappear there.`)) return;
        try {
            await deleteMedia(item._id).unwrap();
            toast.success('Deleted');
        } catch {
            toast.error('Could not delete it');
        }
    };

    return (
        <Modal open={open} onClose={onClose} title="Media library" subtitle="Pick a file, or upload a new one. Pictures are made lighter automatically." width="max-w-5xl"
            footer={<Btn onClick={onClose}>Close</Btn>}>
            <div className="mb-4 flex flex-wrap items-center gap-2">
                {(kind === 'any' ? (['any', 'image', 'video'] as Kind[]) : [kind]).map((k) => (
                    <button key={k} type="button" onClick={() => setTab(k)}
                        className={cx('rounded-full px-3.5 py-1.5 text-sm font-medium transition', tab === k ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>
                        {k === 'any' ? 'All' : k === 'image' ? 'Pictures' : 'Videos'}
                    </button>
                ))}
                <span className="ml-auto text-xs text-gray-400">{isFetching ? 'Loading…' : `${data?.meta?.total ?? items.length} files`}</span>
            </div>

            <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => { e.preventDefault(); setDragging(false); upload(e.dataTransfer.files); }}
                onClick={() => input.current?.click()}
                className={cx('mb-5 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-7 text-center transition',
                    dragging ? 'border-[var(--color-primary)] bg-[var(--color-primary-lightest)]' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50')}
            >
                <LuCloudUpload size={26} className="text-gray-400" />
                <p className="mt-2 text-sm font-medium text-gray-800">Drop files here, or click to upload</p>
                <p className="mt-0.5 text-xs text-gray-400">
                    {kind === 'video' ? 'MP4 or WebM, up to 100 MB' : kind === 'image' ? 'JPG, PNG, WebP, SVG — up to 15 MB' : 'Pictures up to 15 MB, videos up to 100 MB'}
                </p>
                <input ref={input} type="file" multiple accept={accept} className="hidden" onChange={(e) => { if (e.target.files) upload(e.target.files); e.target.value = ''; }} />
            </div>

            {uploading.length > 0 && (
                <div className="mb-5 space-y-2">
                    {uploading.map((u, i) => (
                        <div key={i} className="rounded-lg border border-gray-200 px-3 py-2">
                            <div className="flex justify-between text-xs text-gray-600"><span className="truncate">{u.name}</span><span>{u.pct}%</span></div>
                            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-gray-100">
                                <div className="h-full rounded-full bg-[var(--color-primary)] transition-all" style={{ width: `${u.pct}%` }} />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {items.length === 0 && !isFetching ? (
                <p className="py-10 text-center text-sm text-gray-400">Nothing uploaded yet.</p>
            ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                    {items.map((item) => {
                        const url = resolveMedia(item.url) as string;
                        return (
                            <div key={item._id} className="group relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                                <button type="button" onClick={() => { onPick(item); onClose(); }} className="block w-full text-left">
                                    <div className="relative aspect-[4/3] bg-[repeating-conic-gradient(#f3f4f6_0%_25%,#fff_0%_50%)] bg-[length:16px_16px]">
                                        {item.kind === 'video' ? (
                                            <video src={url} muted preload="metadata" className="h-full w-full object-cover" />
                                        ) : (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={url} alt={item.name} loading="lazy" className="h-full w-full object-contain" />
                                        )}
                                        <span className="absolute left-2 top-2 rounded bg-black/55 px-1.5 py-0.5 text-[10px] font-medium text-white">
                                            {item.kind === 'video' ? <LuVideo className="inline" size={11} /> : <LuImage className="inline" size={11} />}
                                        </span>
                                        <span className="absolute inset-0 flex items-center justify-center bg-black/0 text-white opacity-0 transition group-hover:bg-black/35 group-hover:opacity-100">
                                            <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-900"><LuCheck size={13} /> Use</span>
                                        </span>
                                    </div>
                                    <div className="px-2.5 py-2">
                                        <p className="truncate text-xs font-medium text-gray-800" title={item.name}>{item.name}</p>
                                        <p className="text-[11px] text-gray-400">{item.width && item.height ? `${item.width}×${item.height} · ` : ''}{kb(item.size)}</p>
                                    </div>
                                </button>
                                <button type="button" onClick={() => remove(item)} aria-label="Delete"
                                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-red-600 opacity-0 shadow transition hover:bg-white group-hover:opacity-100">
                                    <LuTrash2 size={14} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </Modal>
    );
}
