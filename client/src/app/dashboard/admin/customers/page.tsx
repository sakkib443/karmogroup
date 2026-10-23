/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { LuPlus, LuEye, LuBan, LuCircleCheck, LuPencil, LuUsers, LuTrash2, LuGift, LuShoppingCart } from 'react-icons/lu';
import PageGuide from '@/components/admin/PageGuide';
import { canManageUser } from '@/components/admin/access';
import { UserFormModal, useUserActions } from '@/components/admin/users/UserForm';
import {
    useGetCustomersQuery,
    useUpdateUserMutation,
    useCreateCustomerMutation,
} from '@/redux/api/userApi';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import toast from 'react-hot-toast';
import {
    PageHeader, Btn, SearchInput, SelectPill, FilterBar, StatTile, Badge, TableCard,
    TH, TD, TR, EmptyRow, SkeletonRows, Pager, RowMenu, Modal, Field, INPUT, taka, fmtDate, type Tone,
} from '@/components/admin/ui';

// Buyers only. Everyone who orders becomes one (a guest or phone order makes the account
// from the phone number), and so does everyone who signs up. Every account, staff too, is
// on Settings → Users. Managers see this list and add buyers; admins also edit, block and
// delete them.
const PAGE_SIZE = 20;
const COLS = 8;

const STATUS_TONE: Record<string, Tone> = { active: 'green', blocked: 'red', pending: 'amber' };

function useDebounced<T>(value: T, ms = 300) {
    const [v, setV] = useState(value);
    useEffect(() => { const t = setTimeout(() => setV(value), ms); return () => clearTimeout(t); }, [value, ms]);
    return v;
}

const errMsg = (err: any, fallback: string) =>
    err?.data?.errorMessages?.[0]?.message || err?.data?.message || fallback;

const EMPTY_CUSTOMER = { firstName: '', lastName: '', phone: '', email: '', defaultDiscount: '', loyaltyPoints: '' };

export default function CustomersPage() {
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('all');
    const [orders, setOrders] = useState('all');
    const [joined, setJoined] = useState('all');
    const [sort, setSort] = useState('recent');
    const [page, setPage] = useState(1);
    const q = useDebounced(search);

    const currentUser = useSelector((s: RootState) => s.auth.user);

    const { data: usersData, isLoading, isFetching } = useGetCustomersQuery({
        page,
        limit: PAGE_SIZE,
        status: status !== 'all' ? status : undefined,
        orders: orders !== 'all' ? orders : undefined,
        joined: joined !== 'all' ? joined : undefined,
        sort,
        search: q || undefined,
    });
    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
    const [createCustomer, { isLoading: isCreatingCustomer }] = useCreateCustomerMutation();

    const rows: any[] = usersData?.data?.customers || [];
    const meta = usersData?.meta || { total: 0, totalPages: 1 };
    const c = usersData?.data?.stats || { total: 0, ordered: 0, never: 0, repeat: 0, fromOrders: 0, newThisMonth: 0 };

    const pickStatus = (v: string) => { setStatus(v); setPage(1); };
    const pickOrders = (v: string) => { setOrders(v); setPage(1); };

    /* ─── Add customer ─── */
    const [addOpen, setAddOpen] = useState(false);
    const [cForm, setCForm] = useState(EMPTY_CUSTOMER);

    const handleAddCustomer = async () => {
        if (!cForm.firstName.trim() || !cForm.phone.trim()) {
            toast.error('Name and phone number are required');
            return;
        }
        try {
            await createCustomer({
                firstName: cForm.firstName.trim(),
                lastName: cForm.lastName.trim() || undefined,
                phone: cForm.phone.trim(),
                email: cForm.email.trim() || undefined,
                defaultDiscount: cForm.defaultDiscount ? Number(cForm.defaultDiscount) : undefined,
            }).unwrap();
            toast.success('Customer added');
            setAddOpen(false);
            setCForm(EMPTY_CUSTOMER);
        } catch (err: any) {
            toast.error(errMsg(err, 'Failed to add customer'));
        }
    };

    /* ─── Loyalty & discount ─── */
    const [editing, setEditing] = useState<any>(null);
    const [lForm, setLForm] = useState({ loyaltyPoints: '0', defaultDiscount: '0' });

    const openLoyalty = (u: any) => {
        setEditing(u);
        setLForm({ loyaltyPoints: String(u.loyaltyPoints || 0), defaultDiscount: String(u.defaultDiscount || 0) });
    };

    const handleSaveLoyalty = async () => {
        const discount = Number(lForm.defaultDiscount || 0);
        if (!(discount >= 0 && discount <= 100)) { toast.error('Discount must be between 0 and 100%'); return; }
        try {
            await updateUser({ id: editing._id, defaultDiscount: discount }).unwrap();
            toast.success('Saved');
            setEditing(null);
        } catch (err: any) {
            toast.error(errMsg(err, 'Failed to save'));
        }
    };

    /* ─── Edit / block / delete (super admin and admins) ─── */
    const manage = canManageUser(currentUser?.role, 'user');
    // Managers also correct a customer's details and password (not block or delete).
    const mayEdit = manage || currentUser?.role === 'manager';
    const [editingUser, setEditingUser] = useState<any>(null);
    const { toggleBlock: handleToggleBlock, remove } = useUserActions();
    const canBlock = (u: any) => manage && u._id !== currentUser?.id;

    return (
        <div>
            <PageHeader
                title="Customers"
                subtitle="Everyone who ordered or signed up — and how often they order."
                actions={<>
                    <Btn variant="primary" icon={<LuPlus size={16} />} onClick={() => setAddOpen(true)}>Add customer</Btn>
                    <PageGuide page="customers" />
                </>}
            />

            <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
                <StatTile label="Customers" value={c.total.toLocaleString('en-IN')} hint={`${c.newThisMonth.toLocaleString('en-IN')} new this month`} active={orders === 'all'} onClick={() => pickOrders('all')} />
                <StatTile label="Ordered" value={c.ordered.toLocaleString('en-IN')} hint={`${c.fromOrders.toLocaleString('en-IN')} joined by ordering`} active={orders === 'ordered'} onClick={() => pickOrders('ordered')} />
                <StatTile label="Ordered 2+ times" value={c.repeat.toLocaleString('en-IN')} hint="Regulars" active={orders === 'repeat'} onClick={() => pickOrders('repeat')} />
                <StatTile label="Never ordered" value={c.never.toLocaleString('en-IN')} hint="Signed up only" active={orders === 'never'} onClick={() => pickOrders('never')} />
            </div>

            <FilterBar>
                <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search name, phone, email…" />
                <SelectPill
                    ariaLabel="Status"
                    value={status}
                    onChange={pickStatus}
                    className="sm:w-40"
                    options={[
                        { value: 'all', label: 'All statuses' },
                        { value: 'active', label: 'Active' },
                        { value: 'blocked', label: 'Blocked' },
                        { value: 'pending', label: 'Pending' },
                    ]}
                />
                <SelectPill ariaLabel="Joined" value={joined} onChange={(v) => { setJoined(v); setPage(1); }} className="sm:w-44"
                    options={[{ value: 'all', label: 'Joined any way' }, { value: 'order', label: 'By ordering' }, { value: 'signup', label: 'By signing up' }]} />
                <SelectPill ariaLabel="Sort" value={sort} onChange={(v) => { setSort(v); setPage(1); }} className="sm:w-44"
                    options={[{ value: 'recent', label: 'Newest first' }, { value: 'orders', label: 'Most orders' }, { value: 'spent', label: 'Most spent' }, { value: 'last', label: 'Last ordered' }]} />
            </FilterBar>

            <TableCard footer={<Pager page={page} totalPages={meta.totalPages} total={meta.total} pageSize={PAGE_SIZE} count={rows.length} onPage={setPage} noun="customers" />}>
                <table className={`w-full ${isFetching && !isLoading ? 'opacity-60' : ''}`}>
                    <thead>
                        <tr>
                            <th className={`${TH} w-12`}>#</th>
                            <th className={TH}>Customer</th>
                            <th className={`${TH} text-right`} title="Orders placed, not counting cancelled ones">Orders</th>
                            <th className={`${TH} text-right`} title="Total of delivered orders">Spent</th>
                            <th className={TH}>Last order</th>
                            <th className={TH}>Joined</th>
                            <th className={TH}>Status</th>
                            <th className={`${TH} w-12`} />
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? <SkeletonRows cols={COLS} /> : rows.length === 0 ? (
                            <EmptyRow colSpan={COLS}>
                                <LuUsers size={28} className="mx-auto mb-2 text-gray-300" />
                                {search || status !== 'all' || orders !== 'all' || joined !== 'all' ? 'Nobody matches these filters.' : 'No customers yet.'}
                            </EmptyRow>
                        ) : rows.map((u, i) => {
                            const n = (page - 1) * PAGE_SIZE + i + 1;
                            const fullName = `${u.firstName || ''} ${u.lastName || ''}`.trim() || '—';
                            const statusBadge = <Badge tone={STATUS_TONE[u.status] || 'gray'}><span className="capitalize">{u.status}</span></Badge>;
                            const blockItem = u.status === 'blocked'
                                ? { label: 'Unblock', icon: <LuCircleCheck size={15} />, onClick: () => handleToggleBlock(u), hidden: !canBlock(u) }
                                : { label: 'Block', icon: <LuBan size={15} />, onClick: () => handleToggleBlock(u), danger: true, hidden: !canBlock(u) };

                            return (
                                <tr key={u._id} className={TR}>
                                    <td className={`${TD} text-gray-400`}>{n}</td>
                                    <td className={TD}>
                                        <Link href={`/dashboard/admin/customers/${u._id}`} className="font-medium text-gray-900 hover:text-[var(--color-primary)]">{fullName}</Link>
                                        <p className="mt-0.5 text-xs text-gray-400">
                                            {u.phone || u.email}
                                            {u.defaultDiscount > 0 && <Badge tone="orange" className="ml-1.5">{u.defaultDiscount}% off</Badge>}
                                        </p>
                                    </td>
                                    <td className={`${TD} text-right`}>
                                        {u.orders ? (
                                            <>
                                                <span className={`inline-flex min-w-7 justify-center rounded-full px-2 py-0.5 text-xs font-semibold ${u.placed >= 2 ? 'bg-violet-100 text-violet-700' : 'bg-gray-100 text-gray-700'}`}>{u.placed}</span>
                                                <p className="mt-0.5 whitespace-nowrap text-[11px] text-gray-400">{u.delivered} delivered{u.cancelled ? ` · ${u.cancelled} cancelled` : ''}</p>
                                            </>
                                        ) : <span className="text-xs text-gray-400">None yet</span>}
                                    </td>
                                    <td className={`${TD} whitespace-nowrap text-right`}>{u.spent ? taka(u.spent) : <span className="text-gray-400">—</span>}</td>
                                    <td className={`${TD} whitespace-nowrap text-gray-500`}>{u.lastOrderAt ? fmtDate(u.lastOrderAt) : <Badge tone="amber">Never ordered</Badge>}</td>
                                    <td className={`${TD} whitespace-nowrap`}>
                                        <span className="text-gray-500">{fmtDate(u.createdAt)}</span>
                                        <p className="text-[11px] text-gray-400">{u.joinedByOrder ? 'By ordering' : 'Signed up'}</p>
                                    </td>
                                    <td className={TD}>{statusBadge}</td>
                                    <td className={`${TD} text-right`}>
                                        <RowMenu items={[
                                            { label: 'View details', icon: <LuEye size={15} />, href: `/dashboard/admin/customers/${u._id}` },
                                            { label: 'Their orders', icon: <LuShoppingCart size={15} />, href: `/dashboard/admin/orders?search=${encodeURIComponent(u.phone || u.email || '')}`, hidden: !u.orders },
                                            { label: 'Edit details & password', icon: <LuPencil size={15} />, onClick: () => setEditingUser(u), hidden: !mayEdit },
                                            { label: 'Discount', icon: <LuGift size={15} />, onClick: () => openLoyalty(u), hidden: !mayEdit },
                                            blockItem,
                                            { label: 'Delete', icon: <LuTrash2 size={15} />, onClick: () => remove(u), danger: true, hidden: !canBlock(u) },
                                        ]} />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </TableCard>

            {/* ═══ Add customer ═══ */}
            <Modal
                open={addOpen}
                onClose={() => setAddOpen(false)}
                title="Add customer"
                subtitle="For phone and walk-in buyers. They can set a password later with “Forgot password”."
                footer={<>
                    <Btn onClick={() => setAddOpen(false)}>Cancel</Btn>
                    <Btn variant="primary" onClick={handleAddCustomer} disabled={isCreatingCustomer}>{isCreatingCustomer ? 'Adding…' : 'Add customer'}</Btn>
                </>}
            >
                <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="First name" required>
                        <input className={INPUT} value={cForm.firstName} autoFocus onChange={(e) => setCForm({ ...cForm, firstName: e.target.value })} />
                    </Field>
                    <Field label="Last name">
                        <input className={INPUT} value={cForm.lastName} onChange={(e) => setCForm({ ...cForm, lastName: e.target.value })} />
                    </Field>
                    <Field label="Phone" required>
                        <input className={INPUT} inputMode="tel" placeholder="01XXXXXXXXX" value={cForm.phone} onChange={(e) => setCForm({ ...cForm, phone: e.target.value })} />
                    </Field>
                    <Field label="Email" hint="Optional.">
                        <input className={INPUT} type="email" value={cForm.email} onChange={(e) => setCForm({ ...cForm, email: e.target.value })} />
                    </Field>
                    <Field label="Default discount (%)" hint="Optional.">
                        <input className={INPUT} type="number" min={0} max={100} step="0.5" value={cForm.defaultDiscount} onChange={(e) => setCForm({ ...cForm, defaultDiscount: e.target.value })} />
                    </Field>
                </div>
            </Modal>

            {editingUser && <UserFormModal user={editingUser} onClose={() => setEditingUser(null)} />}

            {/* ═══ Points & discount ═══ */}
            <Modal
                open={!!editing}
                onClose={() => setEditing(null)}
                title="Discount"
                subtitle={editing ? `${editing.firstName} ${editing.lastName || ''} · ${editing.phone || editing.email}` : ''}
                width="max-w-md"
                footer={<>
                    <Btn onClick={() => setEditing(null)}>Cancel</Btn>
                    <Btn variant="primary" onClick={handleSaveLoyalty} disabled={isUpdating}>{isUpdating ? 'Saving…' : 'Save'}</Btn>
                </>}
            >
                <div className="grid gap-4">
                    <Field label="Default discount (%)" hint="Taken off this customer's orders by default.">
                        <input className={INPUT} type="number" min={0} max={100} step="0.5" value={lForm.defaultDiscount} onChange={(e) => setLForm({ ...lForm, defaultDiscount: e.target.value })} />
                    </Field>
                </div>
            </Modal>
        </div>
    );
}
