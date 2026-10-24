"use client";

/**
 * Inquiries — messages from the website: the contact form above the footer, the chat
 * bubble's "Leave a message", and product pages. The desk calls back and marks each
 * New → Called → Closed, with a note. Super admin, admin, manager, online sales.
 */
import React, { useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { LuPhone, LuMessageSquare, LuCheck, LuTrash2, LuPlus } from 'react-icons/lu';
import { FaWhatsapp } from 'react-icons/fa';
import PageGuide from '@/components/admin/PageGuide';
import { useViewRole } from '@/components/admin/viewRole';
import { PageHeader, SearchInput, Segmented, StatTile, Badge, Btn, Modal, Field, TEXTAREA, Pager, fmtDateTime, cx, type Tone } from '@/components/admin/ui';
import { useGetInquiriesQuery, useUpdateInquiryStatusMutation, useDeleteInquiryMutation } from '@/redux/api/inquiryApi';

type Inquiry = {
    _id: string; name: string; phone: string; message: string; status: 'pending' | 'replied' | 'closed';
    source?: 'contact_form' | 'chat' | 'product'; page?: string; adminReply?: string; createdAt: string;
    product?: { name?: string; slug?: string } | null; handledBy?: { name?: string }; handledAt?: string;
};

const STATUS: Record<Inquiry['status'], { label: string; tone: Tone }> = {
    pending: { label: 'New', tone: 'amber' },
    replied: { label: 'Called', tone: 'blue' },
    closed: { label: 'Closed', tone: 'green' },
};
const SOURCE: Record<string, string> = { contact_form: 'Contact form', chat: 'Chat', product: 'Product page' };
const PAGE_SIZE = 20;

const isMobile = (p: string) => /^01\d{9}$/.test(p);
const waLink = (p: string) => `https://wa.me/88${p}`;

export default function InquiriesPage() {
    const [status, setStatus] = useState<'all' | Inquiry['status']>('pending');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [open, setOpen] = useState<Inquiry | null>(null);
    const [note, setNote] = useState('');
    const { role } = useViewRole();

    const { data, isLoading, isFetching, refetch } = useGetInquiriesQuery({
        status: status !== 'all' ? status : undefined, searchTerm: search.trim() || undefined, page, limit: PAGE_SIZE,
    });
    const [update, { isLoading: saving }] = useUpdateInquiryStatusMutation();
    const [remove] = useDeleteInquiryMutation();
    const rows: Inquiry[] = data?.data || [];
    const meta = data?.meta || { total: 0, totalPages: 1 };
    const sum = meta.summary || { pending: 0, replied: 0, closed: 0, total: 0 };
    const pick = (s: typeof status) => { setStatus(s); setPage(1); };

    const openOne = (q: Inquiry) => { setOpen(q); setNote(q.adminReply || ''); };
    const save = async (next: Inquiry['status']) => {
        if (!open) return;
        try {
            await update({ id: open._id, data: { status: next, adminReply: note } }).unwrap();
            toast.success(`Marked ${STATUS[next].label}`);
            setOpen(null);
            refetch();
        } catch (e) {
            toast.error((e as { data?: { message?: string } })?.data?.message || 'Could not save');
        }
    };
    const del = async (q: Inquiry) => {
        if (!window.confirm(`Delete the message from ${q.name}?`)) return;
        try { await remove(q._id).unwrap(); toast.success('Deleted'); setOpen(null); refetch(); } catch { toast.error('Could not delete'); }
    };

    return (
        <div className={cx('transition-opacity', isFetching && !isLoading && 'opacity-70')}>
            <PageHeader title="Inquiries" subtitle="Messages from the website — call back and mark them done." actions={<PageGuide page="inquiries" />} />

            <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
                <StatTile label="New" value={sum.pending} hint="Call these back" active={status === 'pending'} onClick={() => pick('pending')} />
                <StatTile label="Called" value={sum.replied} active={status === 'replied'} onClick={() => pick('replied')} />
                <StatTile label="Closed" value={sum.closed} active={status === 'closed'} onClick={() => pick('closed')} />
                <StatTile label="All" value={sum.total} active={status === 'all'} onClick={() => pick('all')} />
            </div>

            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <Segmented value={status} onChange={pick} options={[{ value: 'pending', label: 'New' }, { value: 'replied', label: 'Called' }, { value: 'closed', label: 'Closed' }, { value: 'all', label: 'All' }]} />
                <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search name, phone, message…" className="sm:w-72" />
            </div>

            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                {!rows.length ? (
                    <div className="px-5 py-14 text-center text-sm text-gray-500">
                        <LuMessageSquare size={28} className="mx-auto mb-2 text-gray-300" />
                        {isLoading ? 'Loading…' : status === 'pending' ? 'No new messages.' : 'Nothing here.'}
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-100">
                        {rows.map((q) => (
                            <li key={q._id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-start">
                                <button type="button" onClick={() => openOne(q)} className="min-w-0 flex-1 text-left">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="font-semibold text-gray-900">{q.name}</span>
                                        <span className="font-mono text-xs text-gray-500">{q.phone}</span>
                                        <Badge tone={STATUS[q.status].tone}>{STATUS[q.status].label}</Badge>
                                    </div>
                                    <p className="mt-1 line-clamp-2 text-sm text-gray-700">{q.message}</p>
                                    <p className="mt-1 text-xs text-gray-400">
                                        {fmtDateTime(q.createdAt)} · {SOURCE[q.source || 'contact_form']}{q.product?.name ? ` · ${q.product.name}` : q.page ? ` · ${q.page}` : ''}
                                        {q.handledBy?.name && ` · ${STATUS[q.status].label} by ${q.handledBy.name}`}
                                    </p>
                                    {q.adminReply && <p className="mt-1 text-xs text-sky-700">Note: {q.adminReply}</p>}
                                </button>
                                <div className="flex shrink-0 items-center gap-2">
                                    {isMobile(q.phone) && <>
                                        <a href={`tel:${q.phone}`} className="inline-flex h-9 items-center gap-1.5 rounded-full border border-gray-200 px-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"><LuPhone size={14} /> Call</a>
                                        <a href={waLink(q.phone)} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-emerald-600 hover:bg-emerald-50"><FaWhatsapp size={16} /></a>
                                    </>}
                                    <Btn onClick={() => openOne(q)} icon={<LuCheck size={14} />}>Update</Btn>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
                {meta.totalPages > 1 && <div className="border-t border-gray-100 px-5 py-3"><Pager page={page} totalPages={meta.totalPages} total={meta.total} pageSize={PAGE_SIZE} count={rows.length} onPage={setPage} noun="messages" /></div>}
            </section>

            <Modal open={!!open} onClose={() => setOpen(null)} title={open ? `${open.name} · ${open.phone}` : ''}
                subtitle={open ? `${fmtDateTime(open.createdAt)} · ${SOURCE[open.source || 'contact_form']}${open.page ? ` · ${open.page}` : ''}` : ''}
                footer={open && <>
                    {(role === 'superadmin' || role === 'admin') && <Btn variant="ghost" icon={<LuTrash2 size={14} />} onClick={() => del(open)} className="mr-auto text-red-600">Delete</Btn>}
                    {open.status !== 'pending' && <Btn onClick={() => save('pending')} disabled={saving}>Back to New</Btn>}
                    <Btn onClick={() => save('replied')} disabled={saving}>Called</Btn>
                    <Btn variant="primary" onClick={() => save('closed')} disabled={saving}>Close</Btn>
                </>}>
                {open && (
                    <div className="space-y-4">
                        <p className="whitespace-pre-line rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-800">{open.message}</p>
                        {isMobile(open.phone) && (
                            <div className="flex flex-wrap gap-2">
                                <a href={`tel:${open.phone}`} className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[var(--color-primary)] px-4 text-sm font-semibold text-white"><LuPhone size={14} /> Call {open.phone}</a>
                                <a href={waLink(open.phone)} target="_blank" rel="noopener noreferrer" className="inline-flex h-9 items-center gap-1.5 rounded-full border border-gray-200 px-4 text-sm font-semibold text-emerald-700"><FaWhatsapp size={15} /> WhatsApp</a>
                                <Link href={`/dashboard/admin/orders/new?phone=${open.phone}&name=${encodeURIComponent(open.name)}`} className="inline-flex h-9 items-center gap-1.5 rounded-full border border-gray-200 px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50"><LuPlus size={14} /> New order</Link>
                            </div>
                        )}
                        <Field label="Note" hint="What was said on the call — the next person sees it.">
                            <textarea rows={3} className={TEXTAREA} value={note} onChange={(e) => setNote(e.target.value)} />
                        </Field>
                    </div>
                )}
            </Modal>
        </div>
    );
}
