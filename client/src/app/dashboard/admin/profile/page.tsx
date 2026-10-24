"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
    FiLock, FiCamera, FiImage, FiShield, FiCheckCircle, FiEye, FiEyeOff, FiCalendar, FiMail, FiKey, FiPhone, FiActivity,
} from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useGetMeQuery, useUpdateProfileMutation } from '@/redux/api/userApi';
import { useUpdatePasswordMutation } from '@/redux/api/authApi';
import { useUploadMyImagesMutation } from '@/redux/api/uploadApi';
import { ROLE_LABEL, ROLE_HINT, ROLE_ACCESS, STAFF_ROLES, type StaffRole } from '@/components/admin/access';
import { toast } from 'react-hot-toast';
import { useGetMineQuery, type StaffCounts } from '@/redux/api/reportApi';
import { getStatusConfig } from '@/lib/orderStatus';
import { dhakaToday, addDays } from '../analytics/_components/period';

/** The numbers that matter for each role, shown under "Your work". */
const WORK: Record<string, { key: keyof StaffCounts; label: string }[]> = {
    agency: [{ key: 'confirmed', label: 'Confirmed' }, { key: 'cancelled', label: 'Cancelled' }, { key: 'sms', label: 'SMS sent' }],
    online_sales: [{ key: 'taken', label: 'Orders taken' }, { key: 'confirmed', label: 'Confirmed' }, { key: 'shipped', label: 'Sent to courier' }, { key: 'inquiries', label: 'Inquiries called' }],
    manager: [{ key: 'taken', label: 'Orders taken' }, { key: 'confirmed', label: 'Confirmed' }, { key: 'inquiries', label: 'Inquiries called' }, { key: 'sms', label: 'SMS sent' }],
    factory: [{ key: 'scans', label: 'Pieces scanned' }, { key: 'challans', label: 'Challans issued' }],
    admin: [{ key: 'taken', label: 'Orders taken' }, { key: 'confirmed', label: 'Confirmed' }, { key: 'shipped', label: 'Sent to courier' }, { key: 'challans', label: 'Challans issued' }],
    superadmin: [{ key: 'taken', label: 'Orders taken' }, { key: 'confirmed', label: 'Confirmed' }, { key: 'shipped', label: 'Sent to courier' }, { key: 'challans', label: 'Challans issued' }],
};
const PERIODS = [
    { key: 'today', label: 'Today', from: () => dhakaToday() },
    { key: '7d', label: '7 days', from: () => addDays(dhakaToday(), -6) },
    { key: 'month', label: 'This month', from: () => `${dhakaToday().slice(0, 8)}01` },
];
const when = (d: string) => new Date(d).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });

const inputCls = 'w-full h-10 px-3.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/15 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed';
const labelCls = 'block text-sm font-medium text-gray-700 mb-1.5';

const STATUS_STYLE: Record<string, string> = {
    active: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    pending: 'bg-amber-50 text-amber-700 ring-amber-600/20',
    blocked: 'bg-red-50 text-red-700 ring-red-600/20',
};

/** 0–4: length, mixed case, a digit, a symbol. */
function passwordScore(pw: string) {
    if (!pw) return 0;
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++;
    if (/\d/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
}
const SCORE_LABEL = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'];
const SCORE_COLOR = ['bg-gray-200', 'bg-red-500', 'bg-amber-500', 'bg-lime-500', 'bg-emerald-500'];

function Card({ title, description, children, footer }: { title: string; description?: string; children: React.ReactNode; footer?: React.ReactNode }) {
    return (
        <section className="rounded-2xl border border-gray-200 bg-white">
            <header className="border-b border-gray-100 px-5 py-3.5">
                <h2 className="text-[15px] font-semibold text-gray-900">{title}</h2>
                {description && <p className="mt-0.5 text-sm text-gray-500">{description}</p>}
            </header>
            <div className="px-5 py-4">{children}</div>
            {footer && <footer className="flex items-center justify-end gap-3 rounded-b-2xl border-t border-gray-100 bg-gray-50/60 px-5 py-3">{footer}</footer>}
        </section>
    );
}

function PasswordInput({ value, onChange, placeholder, autoComplete }: { value: string; onChange: (v: string) => void; placeholder?: string; autoComplete?: string }) {
    const [show, setShow] = useState(false);
    return (
        <div className="relative">
            <input type={show ? 'text' : 'password'} value={value} onChange={(e) => onChange(e.target.value)} className={`${inputCls} pr-10`} placeholder={placeholder} autoComplete={autoComplete} />
            <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? 'Hide password' : 'Show password'} className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-gray-400 hover:text-gray-600">
                {show ? <FiEyeOff size={15} /> : <FiEye size={15} />}
            </button>
        </div>
    );
}

export default function AdminProfilePage() {
    const { data: meData, isLoading } = useGetMeQuery(undefined);
    const user = meData?.data;
    const authUser = useSelector((state: RootState) => state.auth.user);
    const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
    const [updatePassword, { isLoading: isChangingPw }] = useUpdatePasswordMutation();
    const [uploadMyImages] = useUploadMyImagesMutation();

    const fileRef = useRef<HTMLInputElement>(null);
    const coverRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadingCover, setUploadingCover] = useState(false);

    const [profile, setProfile] = useState({ firstName: '', lastName: '', phone: '' });

    const [showPw, setShowPw] = useState(false);
    const [period, setPeriod] = useState('month');
    const range = { from: (PERIODS.find((x) => x.key === period) || PERIODS[2]).from(), to: dhakaToday() };
    const [pw, setPw] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

    useEffect(() => {
        if (user) setProfile({ firstName: user.firstName || '', lastName: user.lastName || '', phone: user.phone || '' });
    }, [user]);

    const role: string = user?.role ?? authUser?.role ?? '';
    const staffRole = STAFF_ROLES.includes(role as StaffRole) ? (role as StaffRole) : null;
    const fullName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || ROLE_LABEL[role] || 'Admin';
    const initials = fullName.split(/\s+/).map((w) => w.charAt(0)).join('').slice(0, 2).toUpperCase() || 'A';
    const status: string = user?.status || 'active';
    const memberSince = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : null;

    const { data: mineData, isLoading: mineLoading } = useGetMineQuery(range, { skip: !STAFF_ROLES.includes(role as StaffRole) });
    const mine = mineData?.data;
    const work = WORK[role] || WORK.admin;

    const dirty = !!user && (
        profile.firstName !== (user.firstName || '') ||
        profile.lastName !== (user.lastName || '') ||
        profile.phone !== (user.phone || '')
    );

    const pickAvatar = () => fileRef.current?.click();

    /** The wide photo behind the header — same upload as the profile photo. */
    const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) { toast.error('Please choose an image file'); return; }
        if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }
        setUploadingCover(true);
        try {
            const fd = new FormData();
            fd.append('images', file);
            const res = await uploadMyImages(fd).unwrap();
            const url = res?.data?.urls?.[0];
            if (!url) throw new Error('Upload failed');
            await updateProfile({ coverImage: url }).unwrap();
            toast.success('Cover photo updated');
        } catch (err: any) {
            toast.error(err?.data?.message || 'Failed to upload the cover photo');
        } finally {
            setUploadingCover(false);
            if (coverRef.current) coverRef.current.value = '';
        }
    };
    const removeCover = async () => {
        try { await updateProfile({ coverImage: '' }).unwrap(); toast.success('Cover photo removed'); } catch { toast.error('Could not remove it'); }
    };
    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) { toast.error('Please choose an image file'); return; }
        if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append('images', file);
            const res = await uploadMyImages(fd).unwrap();
            const url = res?.data?.urls?.[0];
            if (!url) throw new Error('Upload failed');
            await updateProfile({ avatar: url }).unwrap();
            toast.success('Profile photo updated');
        } catch (err: any) {
            toast.error(err?.data?.message || 'Failed to upload photo');
        } finally {
            setUploading(false);
            if (fileRef.current) fileRef.current.value = '';
        }
    };

    const handleProfileSave = async () => {
        if (!profile.firstName.trim()) { toast.error('First name is required'); return; }
        try {
            await updateProfile(profile).unwrap();
            toast.success('Profile updated');
        } catch (err: any) {
            toast.error(err?.data?.message || 'Failed to update profile');
        }
    };

    const discardProfile = () => {
        setProfile({ firstName: user?.firstName || '', lastName: user?.lastName || '', phone: user?.phone || '' });
    };

    const closePw = () => { setShowPw(false); setPw({ currentPassword: '', newPassword: '', confirmPassword: '' }); };
    const handlePasswordChange = async () => {
        if (!pw.currentPassword || !pw.newPassword) { toast.error('Fill in all password fields'); return; }
        if (pw.newPassword.length < 6) { toast.error('New password must be at least 6 characters'); return; }
        if (pw.newPassword !== pw.confirmPassword) { toast.error('Passwords do not match'); return; }
        try {
            await updatePassword({ currentPassword: pw.currentPassword, newPassword: pw.newPassword }).unwrap();
            toast.success('Password changed');
            closePw();
        } catch (err: any) {
            toast.error(err?.data?.message || 'Failed to change password');
        }
    };

    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-[var(--color-primary)] border-t-transparent" />
            </div>
        );
    }

    const score = passwordScore(pw.newPassword);

    return (
        <div className="mx-auto max-w-6xl space-y-5">
            <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            <input ref={coverRef} type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />

            {/* ── Who you are ── */}
            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                <div className="group relative h-36 bg-[linear-gradient(120deg,var(--color-primary),color-mix(in_srgb,var(--color-primary)_45%,#111827))] sm:h-44">
                    {user?.coverImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={user.coverImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
                    ) : null}
                    <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
                    <div className="absolute right-3 top-3 flex gap-2">
                        {user?.coverImage && (
                            <button type="button" onClick={removeCover} disabled={isUpdating}
                                className="h-8 rounded-lg bg-white/85 px-3 text-xs font-medium text-gray-700 shadow-sm backdrop-blur transition hover:bg-white disabled:opacity-60">Remove</button>
                        )}
                        <button type="button" onClick={() => coverRef.current?.click()} disabled={uploadingCover}
                            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-white/85 px-3 text-xs font-medium text-gray-700 shadow-sm backdrop-blur transition hover:bg-white disabled:opacity-60">
                            {uploadingCover ? <span className="h-3 w-3 animate-spin rounded-full border-2 border-gray-300 border-t-[var(--color-primary)]" /> : <FiImage size={13} />}
                            {user?.coverImage ? 'Change cover' : 'Add cover photo'}
                        </button>
                    </div>
                </div>
                <div className="flex flex-col gap-4 px-6 pb-5 sm:flex-row sm:items-end sm:justify-between">
                    <div className="-mt-10 flex items-end gap-4">
                        <div className="relative shrink-0">
                            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-gray-900 text-2xl font-semibold text-white ring-4 ring-white">
                                {user?.avatar ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={user.avatar} alt={fullName} className="h-full w-full object-cover" />
                                ) : initials}
                            </div>
                            <button onClick={pickAvatar} disabled={uploading} aria-label="Change photo" title="Change photo" className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:text-[var(--color-primary)] disabled:opacity-60">
                                {uploading ? <span className="h-3 w-3 animate-spin rounded-full border-2 border-gray-300 border-t-[var(--color-primary)]" /> : <FiCamera size={13} />}
                            </button>
                        </div>
                        <div className="min-w-0 pb-0.5">
                            <h1 className="truncate text-xl font-semibold text-gray-900">{fullName}</h1>
                            <div className="mt-1 flex flex-wrap items-center gap-1.5">
                                <span className="inline-flex items-center gap-1 rounded-md bg-[var(--color-primary)]/10 px-2 py-0.5 text-xs font-medium text-[var(--color-primary)]">
                                    <FiShield size={11} /> {ROLE_LABEL[role as StaffRole] || role}
                                </span>
                                <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium capitalize ring-1 ring-inset ${STATUS_STYLE[status] || STATUS_STYLE.active}`}>{status}</span>
                            </div>
                        </div>
                    </div>
                    <dl className="grid grid-cols-1 gap-x-6 gap-y-1 text-sm sm:grid-cols-3">
                        <div className="flex items-center gap-2 text-gray-600"><FiMail size={14} className="text-gray-400" /><span className="truncate">{user?.email || '—'}</span></div>
                        <div className="flex items-center gap-2 text-gray-600"><FiPhone size={14} className="text-gray-400" />{user?.phone || '—'}</div>
                        <div className="flex items-center gap-2 text-gray-600"><FiCalendar size={14} className="text-gray-400" />Since {memberSince || '—'}</div>
                    </dl>
                </div>
            </section>

            {/* ── Your work ── */}
            {staffRole && (
                <section className="rounded-2xl border border-gray-200 bg-white p-5">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="text-[15px] font-semibold text-gray-900">Your work</h2>
                            <p className="text-sm text-gray-500">What you did in the admin, counted from the orders.</p>
                        </div>
                        <div className="inline-flex rounded-full bg-gray-100 p-1">
                            {PERIODS.map((x) => (
                                <button key={x.key} type="button" onClick={() => setPeriod(x.key)}
                                    className={`h-8 rounded-full px-3.5 text-sm font-medium transition ${period === x.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>{x.label}</button>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                        {work.map((w) => (
                            <div key={w.key} className="rounded-xl bg-gray-50 px-4 py-3">
                                <p className="text-2xl font-semibold tabular-nums text-gray-900">{mineLoading ? '…' : Number(mine?.counts?.[w.key] || 0).toLocaleString('en-IN')}</p>
                                <p className="text-xs text-gray-500">{w.label}</p>
                            </div>
                        ))}
                        <div className="rounded-xl bg-[var(--color-primary)]/[0.07] px-4 py-3">
                            <p className="text-2xl font-semibold tabular-nums text-[var(--color-primary)]">{mineLoading ? '…' : Number(mine?.counts?.total || 0).toLocaleString('en-IN')}</p>
                            <p className="text-xs text-gray-500">Actions in all</p>
                        </div>
                    </div>
                </section>
            )}

            <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
                <div className="space-y-5">
                    {/* ── Personal information ── */}
                    <Card
                        title="Personal information"
                        description="Shown to other staff on orders, notes and the activity log."
                        footer={
                            <>
                                <button onClick={discardProfile} disabled={!dirty || isUpdating} className="h-9 rounded-lg px-4 text-sm font-medium text-gray-600 transition hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent">Discard</button>
                                <button onClick={handleProfileSave} disabled={!dirty || isUpdating} className="h-9 rounded-lg bg-[var(--color-primary)] px-4 text-sm font-medium text-white transition hover:brightness-95 disabled:opacity-40">
                                    {isUpdating ? 'Saving…' : 'Save changes'}
                                </button>
                            </>
                        }
                    >
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className={labelCls} htmlFor="pf-first">First name</label>
                                <input id="pf-first" value={profile.firstName} onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} className={inputCls} placeholder="First name" autoComplete="given-name" />
                            </div>
                            <div>
                                <label className={labelCls} htmlFor="pf-last">Last name</label>
                                <input id="pf-last" value={profile.lastName} onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} className={inputCls} placeholder="Last name" autoComplete="family-name" />
                            </div>
                            <div>
                                <label className={labelCls} htmlFor="pf-phone">Phone</label>
                                <input id="pf-phone" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className={inputCls} placeholder="01XXXXXXXXX" autoComplete="tel" inputMode="tel" />
                            </div>
                            <div>
                                <label className={labelCls} htmlFor="pf-email">Email</label>
                                <input id="pf-email" value={user?.email || ''} disabled className={inputCls} />
                                <p className="mt-1.5 text-xs text-gray-500">Your sign-in ID — an admin can change it.</p>
                            </div>
                        </div>
                    </Card>

                    {/* ── Password ── */}
                    <Card title="Password" description="Change the password you sign in with.">
                        {!showPw ? (
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600"><FiKey size={15} /></span>
                                    <p className="text-sm text-gray-600">Email and password sign-in{user?.isEmailVerified ? ' · email verified' : ''}</p>
                                </div>
                                <button onClick={() => setShowPw(true)} className="h-9 rounded-lg border border-gray-200 px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50">Change password</button>
                            </div>
                        ) : (
                            <div>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                    <div>
                                        <label className={labelCls}>Current</label>
                                        <PasswordInput value={pw.currentPassword} onChange={(v) => setPw({ ...pw, currentPassword: v })} autoComplete="current-password" />
                                    </div>
                                    <div>
                                        <label className={labelCls}>New</label>
                                        <PasswordInput value={pw.newPassword} onChange={(v) => setPw({ ...pw, newPassword: v })} autoComplete="new-password" />
                                        {pw.newPassword && (
                                            <div className="mt-2">
                                                <div className="flex gap-1">
                                                    {[1, 2, 3, 4].map((i) => (
                                                        <span key={i} className={`h-1 flex-1 rounded-full ${i <= score ? SCORE_COLOR[score] : 'bg-gray-200'}`} />
                                                    ))}
                                                </div>
                                                <p className="mt-1 text-xs text-gray-500">{pw.newPassword.length < 6 ? 'At least 6 characters' : SCORE_LABEL[score]}</p>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label className={labelCls}>Confirm new</label>
                                        <PasswordInput value={pw.confirmPassword} onChange={(v) => setPw({ ...pw, confirmPassword: v })} autoComplete="new-password" />
                                        {pw.confirmPassword && pw.newPassword !== pw.confirmPassword && (
                                            <p className="mt-1.5 text-xs font-medium text-red-600">Passwords do not match</p>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-4 flex justify-end gap-3">
                                    <button onClick={closePw} className="h-9 rounded-lg px-4 text-sm font-medium text-gray-600 transition hover:bg-gray-100">Cancel</button>
                                    <button onClick={handlePasswordChange} disabled={isChangingPw} className="h-9 rounded-lg bg-gray-900 px-4 text-sm font-medium text-white transition hover:bg-black disabled:opacity-50">
                                        <FiLock size={13} className="mr-1.5 inline" />{isChangingPw ? 'Updating…' : 'Update password'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>

                <div className="space-y-5">
                    {/* ── Recent activity ── */}
                    {staffRole && (
                        <Card title="Recent activity" description="Your latest changes to orders.">
                            {!mine?.recent?.length ? (
                                <p className="py-4 text-center text-sm text-gray-400">{mineLoading ? 'Loading…' : 'Nothing in this period yet.'}</p>
                            ) : (
                                <ul className="space-y-3">
                                    {mine.recent.map((l, i) => {
                                        const st = getStatusConfig(l.status);
                                        return (
                                            <li key={`${l.orderObjectId}-${i}`} className="flex items-start gap-3">
                                                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500"><FiActivity size={13} /></span>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm text-gray-800">
                                                        <span className={`mr-1.5 rounded px-1.5 py-0.5 text-[11px] font-semibold ${st.badgeBg} ${st.badgeText}`}>{st.label}</span>
                                                        <Link href={`/dashboard/admin/orders/${l.orderObjectId}`} className="font-semibold hover:text-[var(--color-primary)]">{l.orderId}</Link>
                                                    </p>
                                                    <p className="truncate text-xs text-gray-400">{when(l.at)}{l.note ? ` · ${l.note}` : ''}</p>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </Card>
                    )}

                    {/* ── Access ── */}
                    {staffRole && (
                        <Card title="What you can do" description={ROLE_HINT[staffRole]}>
                            <ul className="space-y-2">
                                {ROLE_ACCESS[staffRole].map((line) => (
                                    <li key={line} className={`flex items-start gap-2.5 text-sm ${line.startsWith('Not:') ? 'text-gray-400' : 'text-gray-700'}`}>
                                        <FiCheckCircle size={14} className={`mt-0.5 shrink-0 ${line.startsWith('Not:') ? 'text-gray-300' : 'text-emerald-600'}`} />
                                        {line}
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
