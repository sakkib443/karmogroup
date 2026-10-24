/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

/**
 * One account: who they are, what their role lets them do, their orders (customers),
 * and — for the super admin and admins — every control: edit, new password, role,
 * block and delete. Customers' links open this page too.
 */
import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import {
    LuMail, LuPhone, LuCalendar, LuBadgeCheck, LuCircleAlert, LuPencil, LuKeyRound, LuBan, LuCircleCheck,
    LuTrash2, LuShoppingBag, LuPackageCheck, LuWallet, LuGift, LuMapPin, LuEye, LuShieldCheck, LuFactory,
} from 'react-icons/lu';
import { RootState } from '@/redux/store';
import { useGetAdminUserByIdQuery } from '@/redux/api/userApi';
import { useGetAdminOrdersQuery } from '@/redux/api/orderApi';
import { getStatusConfig } from '@/lib/orderStatus';
import { ROLE_LABEL, ROLE_ACCESS, canManageUser, canOpen, isStaffRole, type StaffRole } from '@/components/admin/access';
import { UserFormModal, useUserActions, fullNameOf, ROLE_TONE, STATUS_TONE, DIVISIONS } from '@/components/admin/users/UserForm';
import { PageHeader, Btn, Badge, Card, StatTile, TableCard, TH, TD, TR, EmptyRow, SkeletonRows, taka, fmtDate, fmtDateTime } from '@/components/admin/ui';

function Avatar({ name, avatar }: { name: string; avatar?: string }) {
    const initials = (name || '?').split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
    if (avatar) return <img src={avatar} alt={name} className="h-16 w-16 rounded-2xl border border-gray-100 object-cover" />;
    return (
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-primary)] text-xl font-semibold text-white">
            {initials}
        </div>
    );
}

function Info({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
    return (
        <div className="flex items-start gap-3">
            <span className="mt-0.5 text-gray-400">{icon}</span>
            <div className="min-w-0">
                <p className="text-xs font-medium text-gray-400">{label}</p>
                <div className="truncate text-sm font-medium text-gray-800">{children}</div>
            </div>
        </div>
    );
}

export default function UserDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = (params?.id as string) || '';
    const me = useSelector((s: RootState) => s.auth.user);

    const { data: userData, isLoading, isError } = useGetAdminUserByIdQuery(id, { skip: !id });
    const u = userData?.data;
    const isCustomer = u?.role === 'user';
    const { data: ordersData, isLoading: ordersLoading } = useGetAdminOrdersQuery({ user: id, limit: 100 }, { skip: !id || !isCustomer });
    const { toggleBlock, remove } = useUserActions();
    const [editing, setEditing] = useState(false);

    const listHref = canOpen(me?.role, '/dashboard/admin/users') ? '/dashboard/admin/users' : '/dashboard/admin/customers';
    const back = { href: listHref, label: listHref.endsWith('users') ? 'All users' : 'Customers' };

    if (isLoading) return <div className="p-8 text-center text-gray-500">Loading…</div>;
    if (isError || !u) {
        return (
            <div>
                <PageHeader title="Account not found" subtitle="It may have been deleted, or the link is wrong." back={back} />
            </div>
        );
    }

    const name = fullNameOf(u);
    const isMe = u._id === me?.id;
    const manage = canManageUser(me?.role, u.role) && !isMe;
    // A manager corrects a customer's details and password too (not block or delete).
    const mayEdit = manage || (me?.role === 'manager' && u.role === 'user');
    const orders: any[] = ordersData?.data || [];
    const placed = orders.filter((o) => o.status !== 'cancelled');
    const delivered = orders.filter((o) => o.status === 'delivered');
    const spent = delivered.reduce((s, o) => s + (o.total || 0), 0);
    const addresses: any[] = u.shippingAddresses || [];

    return (
        <div className="space-y-6">
            <PageHeader
                back={back}
                title={<span className="flex flex-wrap items-center gap-2">{name}{isMe && <span className="text-sm font-normal text-gray-400">(you)</span>}</span>}
                subtitle={isStaffRole(u.role) ? 'Staff account — signs in to this dashboard.' : 'Customer account — shops on the website.'}
                actions={(mayEdit || isMe) && <>
                    <Btn icon={<LuPencil size={15} />} onClick={() => setEditing(true)}>Edit</Btn>
                    {mayEdit && <Btn icon={<LuKeyRound size={15} />} onClick={() => setEditing(true)}>Reset password</Btn>}
                    {manage && (u.status === 'blocked'
                        ? <Btn icon={<LuCircleCheck size={15} />} onClick={() => toggleBlock(u)}>Unblock</Btn>
                        : <Btn icon={<LuBan size={15} />} onClick={() => toggleBlock(u)}>Block</Btn>)}
                    {manage && (
                        <Btn variant="danger" icon={<LuTrash2 size={15} />} onClick={async () => { if (await remove(u)) router.push(listHref); }}>
                            Delete
                        </Btn>
                    )}
                </>}
            />

            {/* Who */}
            <Card>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <Avatar name={name} avatar={u.avatar} />
                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge tone={ROLE_TONE[u.role] || 'gray'}>{ROLE_LABEL[u.role] || u.role}</Badge>
                            <Badge tone={STATUS_TONE[u.status] || 'gray'}><span className="capitalize">{u.status}</span></Badge>
                        </div>
                        <p className="mt-2 flex items-center gap-1.5 text-sm text-gray-600"><LuMail size={14} /> {u.email}</p>
                    </div>
                </div>
                <div className="mt-5 grid grid-cols-1 gap-4 border-t border-gray-100 pt-5 sm:grid-cols-2 lg:grid-cols-4">
                    <Info icon={<LuPhone size={16} />} label="Phone">{u.phone || '—'}</Info>
                    <Info icon={<LuCalendar size={16} />} label="Joined">{fmtDate(u.createdAt)}</Info>
                    <Info icon={u.isEmailVerified ? <LuBadgeCheck size={16} className="text-emerald-500" /> : <LuCircleAlert size={16} />} label="Email">
                        {u.isEmailVerified ? 'Verified' : 'Not verified'}
                    </Info>
                    <Info icon={<LuCalendar size={16} />} label="Last changed">{fmtDateTime(u.updatedAt)}</Info>
                </div>
            </Card>

            {/* Staff: what the role allows */}
            {isStaffRole(u.role) && (
                <Card title="What this role can do" description="Change the role with Edit. The rules are in docs/USER-ROLES.md.">
                    <ul className="space-y-2">
                        {(ROLE_ACCESS[u.role as StaffRole] || []).map((line) => (
                            <li key={line} className="flex items-start gap-2 text-sm text-gray-700">
                                <LuShieldCheck size={15} className="mt-0.5 shrink-0 text-emerald-600" /> {line}
                            </li>
                        ))}
                    </ul>
                    {u.role === 'factory' && (
                        <p className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-4 text-sm text-gray-700">
                            <LuFactory size={15} className="text-teal-600" />
                            Divisions: <b className="font-semibold">{u.divisions?.length ? u.divisions.map((d: string) => DIVISIONS.find((x) => x.key === d)?.label || d).join(', ') : 'All divisions'}</b>
                        </p>
                    )}
                </Card>
            )}

            {/* Customer: orders, terms, addresses */}
            {isCustomer && (<>
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                    <StatTile label="Orders placed" value={placed.length.toLocaleString('en-IN')} icon={<LuShoppingBag size={16} />} />
                    <StatTile label="Delivered" value={delivered.length.toLocaleString('en-IN')} icon={<LuPackageCheck size={16} />} />
                    <StatTile label="Spent" value={taka(spent)} icon={<LuWallet size={16} />} hint="Delivered orders" />
                    <StatTile label="Discount" value={`${u.defaultDiscount || 0}%`} icon={<LuGift size={16} />} />
                </div>

                {addresses.length > 0 && (
                    <Card title="Saved addresses">
                        <div className="grid gap-3 sm:grid-cols-2">
                            {addresses.map((a) => (
                                <div key={a._id} className="rounded-xl border border-gray-200 p-3 text-sm text-gray-700">
                                    <p className="flex items-center gap-1.5 font-semibold text-gray-900">
                                        <LuMapPin size={14} /> {a.label || 'Address'}
                                        {a.isDefault && <Badge tone="green" className="ml-1">Default</Badge>}
                                    </p>
                                    <p className="mt-1">{a.fullName} · {a.phone}</p>
                                    <p className="text-gray-500">{[a.address, a.area, a.city, a.postalCode].filter(Boolean).join(', ')}</p>
                                </div>
                            ))}
                        </div>
                    </Card>
                )}

                <TableCard>
                    <div className="border-b border-gray-100 px-4 py-3"><h2 className="text-[15px] font-semibold text-gray-900">Order history</h2></div>
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className={TH}>Order</th>
                                <th className={TH}>Date</th>
                                <th className={`${TH} text-right`}>Items</th>
                                <th className={`${TH} text-right`}>Total</th>
                                <th className={TH}>Payment</th>
                                <th className={TH}>Status</th>
                                <th className={`${TH} w-12`} />
                            </tr>
                        </thead>
                        <tbody>
                            {ordersLoading ? <SkeletonRows cols={7} /> : orders.length === 0 ? (
                                <EmptyRow colSpan={7}>No orders yet.</EmptyRow>
                            ) : orders.map((o) => (
                                <tr key={o._id} className={TR}>
                                    <td className={`${TD} font-semibold text-gray-900`}>{o.orderId}</td>
                                    <td className={`${TD} whitespace-nowrap text-gray-500`}>{fmtDate(o.createdAt)}</td>
                                    <td className={`${TD} text-right`}>{o.items?.length || 0}</td>
                                    <td className={`${TD} whitespace-nowrap text-right font-medium`}>{taka(o.total)}</td>
                                    <td className={`${TD} capitalize text-gray-500`}>{o.paymentMethod || '—'} · {o.paymentStatus || '—'}</td>
                                    <td className={TD}><Badge>{getStatusConfig(o.status).label}</Badge></td>
                                    <td className={`${TD} text-right`}>
                                        <Link href={`/dashboard/admin/orders/${o._id}`} aria-label="View order" className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-800">
                                            <LuEye size={16} />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </TableCard>
            </>)}

            {editing && <UserFormModal user={u} onClose={() => setEditing(false)} />}
        </div>
    );
}
