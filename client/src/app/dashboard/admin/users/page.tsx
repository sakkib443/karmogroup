/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

/**
 * Users — every account in one place: customers and staff. The super admin adds,
 * changes, blocks and deletes anyone; an admin does the same for customers and the
 * staff below admin (manager, online sales, agency, factory). The server checks the
 * same rules (backend user.service.ts).
 */
import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { LuEye, LuBan, LuCircleCheck, LuTrash2, LuUserPlus, LuUsers, LuPencil, LuKeyRound } from 'react-icons/lu';
import { RootState } from '@/redux/store';
import { useGetAdminUsersQuery, useGetAdminUserStatsQuery } from '@/redux/api/userApi';
import { ROLE_LABEL, STAFF_ROLES, assignableRoles, canManageUser } from '@/components/admin/access';
import { UserFormModal, useUserActions, fullNameOf, ROLE_TONE, STATUS_TONE, DIVISIONS } from '@/components/admin/users/UserForm';
import {
    PageHeader, Btn, SearchInput, SelectPill, FilterBar, StatTile, Badge, TableCard,
    TH, TD, TR, EmptyRow, SkeletonRows, Pager, RowMenu, fmtDate, taka,
} from '@/components/admin/ui';

const PAGE_SIZE = 15;
const COLS = 7;
const FILTERS = ['all', 'user', 'staff', ...STAFF_ROLES];

function useDebounced<T>(value: T, ms = 300) {
    const [v, setV] = useState(value);
    useEffect(() => { const t = setTimeout(() => setV(value), ms); return () => clearTimeout(t); }, [value, ms]);
    return v;
}

export default function UsersPage() {
    return (
        <Suspense fallback={null}>
            <UsersPageInner />
        </Suspense>
    );
}

function UsersPageInner() {
    const roleParam = useSearchParams().get('role') || '';
    const me = useSelector((s: RootState) => s.auth.user);
    const canGive = assignableRoles(me?.role);

    const [role, setRole] = useState(FILTERS.includes(roleParam) ? roleParam : 'all');
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('all');
    const [page, setPage] = useState(1);
    const q = useDebounced(search);

    const { data: usersData, isLoading, isFetching } = useGetAdminUsersQuery({
        page,
        limit: PAGE_SIZE,
        role,
        status: status !== 'all' ? status : undefined,
        searchTerm: q || undefined,
        sort: '-createdAt',
    });
    const { data: statsData } = useGetAdminUserStatsQuery(undefined);
    const { toggleBlock, remove } = useUserActions();

    const rows: any[] = usersData?.data || [];
    const meta = usersData?.meta || { total: 0, totalPages: 1 };
    const st = statsData?.data || {};
    const staff: Record<string, number> = st.staff || {};
    const customers = st.customers || {};

    const [adding, setAdding] = useState(false);
    const [editing, setEditing] = useState<any>(null);

    const pickRole = (r: string) => { setRole(r); setPage(1); };
    const pickStatus = (v: string) => { setStatus(v); setPage(1); };

    const tiles = [
        { key: 'all', label: 'All users', value: st.total },
        { key: 'user', label: 'Customers', value: customers.total },
        { key: 'staff', label: 'All staff', value: staff.total },
        { key: 'superadmin', label: 'Super admins', value: staff.superadmin },
        { key: 'admin', label: 'Admins', value: staff.admin },
        { key: 'manager', label: 'Managers', value: staff.manager },
        { key: 'online_sales', label: 'Online sales', value: staff.online_sales },
        { key: 'agency', label: 'Agency', value: staff.agency },
        { key: 'factory', label: 'Factory', value: staff.factory },
    ];

    // New accounts start with the role of the tab you are on, when you may give it.
    const addRole = canGive.includes(role) ? role : role === 'staff' ? (canGive.find((r) => r !== 'user') || 'user') : 'user';

    return (
        <div>
            <PageHeader
                title="Users"
                subtitle="Every account — customers and staff. Add people, change their details, role and password, block or delete them."
                actions={canGive.length > 0 && <Btn variant="primary" icon={<LuUserPlus size={16} />} onClick={() => setAdding(true)}>Add user</Btn>}
            />

            <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 2xl:grid-cols-9">
                {tiles.map((t) => (
                    <StatTile key={t.key} label={t.label} value={Number(t.value || 0).toLocaleString('en-IN')}
                        active={role === t.key} onClick={() => pickRole(t.key)} />
                ))}
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
            </FilterBar>

            <TableCard footer={<Pager page={page} totalPages={meta.totalPages} total={meta.total} pageSize={PAGE_SIZE} count={rows.length} onPage={setPage} noun="users" />}>
                <table className={`w-full ${isFetching && !isLoading ? 'opacity-60' : ''}`}>
                    <thead>
                        <tr>
                            <th className={`${TH} w-12`}>#</th>
                            <th className={TH}>Name</th>
                            <th className={TH}>Role</th>
                            <th className={TH}>Status</th>
                            <th className={`${TH} text-right`} title="Orders placed (not cancelled) · total of delivered orders">Orders</th>
                            <th className={TH}>Joined</th>
                            <th className={`${TH} w-12`} />
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? <SkeletonRows cols={COLS} /> : rows.length === 0 ? (
                            <EmptyRow colSpan={COLS}>
                                <LuUsers size={28} className="mx-auto mb-2 text-gray-300" />
                                {search || status !== 'all' || role !== 'all' ? 'Nobody matches these filters.' : 'No accounts yet.'}
                            </EmptyRow>
                        ) : rows.map((u, i) => {
                            const n = (page - 1) * PAGE_SIZE + i + 1;
                            const isMe = u._id === me?.id;
                            const manage = canManageUser(me?.role, u.role);
                            return (
                                <tr key={u._id} className={TR}>
                                    <td className={`${TD} text-gray-400`}>{n}</td>
                                    <td className={TD}>
                                        <Link href={`/dashboard/admin/users/${u._id}`} className="font-medium text-gray-900 hover:text-[var(--color-primary)]">
                                            {fullNameOf(u)}
                                        </Link>
                                        {isMe && <span className="ml-2 text-xs font-normal text-gray-400">(you)</span>}
                                        <p className="mt-0.5 text-xs text-gray-400">{u.email}{u.phone ? ` · ${u.phone}` : ''}</p>
                                    </td>
                                    <td className={TD}>
                                        <Badge tone={ROLE_TONE[u.role] || 'gray'}>{ROLE_LABEL[u.role] || u.role}</Badge>
                                        {u.role === 'factory' && (
                                            <p className="mt-1 text-xs text-gray-500">
                                                {u.divisions?.length ? u.divisions.map((d: string) => DIVISIONS.find((x) => x.key === d)?.label || d).join(', ') : 'All divisions'}
                                            </p>
                                        )}
                                    </td>
                                    <td className={TD}><Badge tone={STATUS_TONE[u.status] || 'gray'}><span className="capitalize">{u.status}</span></Badge></td>
                                    <td className={`${TD} whitespace-nowrap text-right`}>
                                        {u.role === 'user' ? (<>
                                            <p className="tabular-nums">{(u.orderCount || 0).toLocaleString('en-IN')}</p>
                                            {u.spent > 0 && <p className="text-xs text-gray-400">{taka(u.spent)}</p>}
                                        </>) : <span className="text-gray-300">—</span>}
                                    </td>
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

            {adding && <UserFormModal defaultRole={addRole} onClose={() => setAdding(false)} />}
            {editing && <UserFormModal user={editing} onClose={() => setEditing(null)} />}
        </div>
    );
}
