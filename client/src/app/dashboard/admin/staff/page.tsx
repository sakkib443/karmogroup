/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

/**
 * Staff — everyone who works in this dashboard, in one place: add a person, change their
 * details, role or password, block or delete them, and see what each role may do.
 * (Customers have their own page.) Super admin and admins; an admin manages the staff below
 * admin, the super admin everyone.
 */
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { LuUserPlus, LuEye, LuPencil, LuKeyRound, LuBan, LuCircleCheck, LuTrash2, LuUsers, LuCheck } from 'react-icons/lu';
import { RootState } from '@/redux/store';
import { useGetAdminUsersQuery, useGetAdminUserStatsQuery } from '@/redux/api/userApi';
import { assignableRoles, canManageUser, ROLE_LABEL, ROLE_ACCESS, ROLE_HINT, STAFF_ROLES, type StaffRole } from '@/components/admin/access';
import { UserFormModal, useUserActions, fullNameOf, ROLE_TONE, STATUS_TONE, DIVISIONS } from '@/components/admin/users/UserForm';
import PageGuide from '@/components/admin/PageGuide';
import {
    PageHeader, Btn, SearchInput, SelectPill, FilterBar, Badge, TableCard, TH, TD, TR, EmptyRow, SkeletonRows, Pager, RowMenu, cx, fmtDate,
} from '@/components/admin/ui';

const PAGE_SIZE = 20;
const COLS = 6;

function useDebounced<T>(value: T, ms = 300) {
    const [v, setV] = useState(value);
    useEffect(() => { const t = setTimeout(() => setV(value), ms); return () => clearTimeout(t); }, [value, ms]);
    return v;
}

export default function StaffPage() {
    const me = useSelector((s: RootState) => s.auth.user);
    const canGive = assignableRoles(me?.role).filter((r) => r !== 'user');
    const [role, setRole] = useState<'staff' | StaffRole>('staff');
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('all');
    const [page, setPage] = useState(1);
    const [adding, setAdding] = useState(false);
    const [editing, setEditing] = useState<any>(null);
    const [showRole, setShowRole] = useState<StaffRole | null>(null);
    const q = useDebounced(search);

    const { data, isLoading, isFetching } = useGetAdminUsersQuery({
        page, limit: PAGE_SIZE, role, status: status !== 'all' ? status : undefined, searchTerm: q || undefined, sort: '-createdAt',
    });
    const { data: statsData } = useGetAdminUserStatsQuery(undefined);
    const { toggleBlock, remove } = useUserActions();
    const rows: any[] = data?.data || [];
    const meta = data?.meta || { total: 0, totalPages: 1 };
    const counts: Record<string, number> = statsData?.data?.staff || {};
    const pick = (r: typeof role) => { setRole(r); setPage(1); };
    const addRole = role !== 'staff' && canGive.includes(role) ? role : canGive[canGive.length - 1] || 'agency';

    return (
        <div>
            <PageHeader title="Staff" subtitle="Everyone who works in this dashboard — add people, set their role, block or remove them."
                actions={<>
                    {canGive.length > 0 && <Btn variant="primary" icon={<LuUserPlus size={16} />} onClick={() => setAdding(true)}>Add staff</Btn>}
                    <PageGuide page="staff_accounts" />
                </>} />

            {/* Roles — count, filter, and what each may do */}
            <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-7">
                <button type="button" onClick={() => pick('staff')}
                    className={cx('rounded-2xl border bg-white p-4 text-left transition', role === 'staff' ? 'border-[var(--color-primary)] shadow-[0_0_0_3px_rgba(var(--color-primary-rgb),0.12)]' : 'border-gray-200 hover:border-gray-300')}>
                    <p className="text-sm text-gray-500">All staff</p>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">{Number(counts.total || 0).toLocaleString('en-IN')}</p>
                </button>
                {STAFF_ROLES.map((r) => (
                    <button key={r} type="button" onClick={() => pick(r)}
                        className={cx('rounded-2xl border bg-white p-4 text-left transition', role === r ? 'border-[var(--color-primary)] shadow-[0_0_0_3px_rgba(var(--color-primary-rgb),0.12)]' : 'border-gray-200 hover:border-gray-300')}>
                        <p className="truncate text-sm text-gray-500">{ROLE_LABEL[r]}</p>
                        <p className="mt-1 text-2xl font-semibold text-gray-900">{Number(counts[r] || 0).toLocaleString('en-IN')}</p>
                    </button>
                ))}
            </div>

            <FilterBar>
                <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search name, phone, email…" />
                <SelectPill ariaLabel="Status" value={status} onChange={(v) => { setStatus(v); setPage(1); }} className="sm:w-40"
                    options={[{ value: 'all', label: 'All statuses' }, { value: 'active', label: 'Active' }, { value: 'blocked', label: 'Blocked' }]} />
            </FilterBar>

            <TableCard footer={<Pager page={page} totalPages={meta.totalPages} total={meta.total} pageSize={PAGE_SIZE} count={rows.length} onPage={setPage} noun="staff" />}>
                <table className={`w-full ${isFetching && !isLoading ? 'opacity-60' : ''}`}>
                    <thead><tr>
                        <th className={TH}>Name</th><th className={TH}>Role</th><th className={TH}>Status</th><th className={TH}>Phone</th><th className={TH}>Joined</th><th className={`${TH} w-12`} />
                    </tr></thead>
                    <tbody>
                        {isLoading ? <SkeletonRows cols={COLS} /> : rows.length === 0 ? (
                            <EmptyRow colSpan={COLS}><LuUsers size={28} className="mx-auto mb-2 text-gray-300" />Nobody here.</EmptyRow>
                        ) : rows.map((u) => {
                            const isMe = u._id === me?.id;
                            const manage = canManageUser(me?.role, u.role);
                            return (
                                <tr key={u._id} className={TR}>
                                    <td className={TD}>
                                        <Link href={`/dashboard/admin/users/${u._id}`} className="font-medium text-gray-900 hover:text-[var(--color-primary)]">{fullNameOf(u)}</Link>
                                        {isMe && <span className="ml-2 text-xs text-gray-400">(you)</span>}
                                        <p className="mt-0.5 text-xs text-gray-400">{u.email}</p>
                                    </td>
                                    <td className={TD}>
                                        <button type="button" onClick={() => setShowRole(u.role)} title="What this role can do">
                                            <Badge tone={ROLE_TONE[u.role] || 'gray'}>{ROLE_LABEL[u.role as StaffRole] || u.role}</Badge>
                                        </button>
                                        {u.role === 'factory' && (
                                            <p className="mt-1 text-xs text-gray-500">{u.divisions?.length ? u.divisions.map((d: string) => DIVISIONS.find((x) => x.key === d)?.label || d).join(', ') : 'All divisions'}</p>
                                        )}
                                    </td>
                                    <td className={TD}><Badge tone={STATUS_TONE[u.status] || 'gray'}><span className="capitalize">{u.status}</span></Badge></td>
                                    <td className={`${TD} text-gray-600`}>{u.phone || '—'}</td>
                                    <td className={`${TD} whitespace-nowrap text-gray-500`}>{fmtDate(u.createdAt)}</td>
                                    <td className={`${TD} text-right`}>
                                        <RowMenu items={[
                                            { label: 'View', icon: <LuEye size={15} />, href: `/dashboard/admin/users/${u._id}` },
                                            { label: 'Edit details & role', icon: <LuPencil size={15} />, onClick: () => setEditing(u), hidden: !manage && !isMe },
                                            { label: 'Reset password', icon: <LuKeyRound size={15} />, onClick: () => setEditing(u), hidden: !manage || isMe },
                                            u.status === 'blocked'
                                                ? { label: 'Unblock', icon: <LuCircleCheck size={15} />, onClick: () => toggleBlock(u), hidden: !manage || isMe }
                                                : { label: 'Block', icon: <LuBan size={15} />, onClick: () => toggleBlock(u), danger: true, hidden: !manage || isMe },
                                            { label: 'Delete', icon: <LuTrash2 size={15} />, onClick: () => remove(u), danger: true, hidden: !manage || isMe },
                                        ]} />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </TableCard>

            {/* What each role may do */}
            <h2 className="mb-3 mt-8 text-[15px] font-semibold text-gray-900">What each role can do</h2>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                {STAFF_ROLES.map((r) => (
                    <section key={r} id={`role-${r}`} className={cx('rounded-2xl border bg-white p-4 transition', showRole === r ? 'border-[var(--color-primary)] shadow-[0_0_0_3px_rgba(var(--color-primary-rgb),0.12)]' : 'border-gray-200')}>
                        <div className="mb-1 flex items-center gap-2">
                            <Badge tone={ROLE_TONE[r] || 'gray'}>{ROLE_LABEL[r]}</Badge>
                            <span className="text-xs text-gray-400">{Number(counts[r] || 0)} {Number(counts[r] || 0) === 1 ? 'person' : 'people'}</span>
                        </div>
                        <p className="mb-2 text-sm text-gray-600">{ROLE_HINT[r]}</p>
                        <ul className="space-y-1">
                            {ROLE_ACCESS[r].map((line) => (
                                <li key={line} className="flex gap-2 text-[13px] text-gray-600">
                                    <LuCheck size={14} className={cx('mt-0.5 shrink-0', line.startsWith('Not:') ? 'text-gray-300' : 'text-emerald-500')} />
                                    <span className={line.startsWith('Not:') ? 'text-gray-400' : ''}>{line}</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                ))}
            </div>

            {adding && <UserFormModal staffOnly defaultRole={addRole} onClose={() => setAdding(false)} />}
            {editing && <UserFormModal staffOnly={editing.role !== 'user'} user={editing} onClose={() => setEditing(null)} />}
        </div>
    );
}
