"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
    FiLock, FiCamera, FiShield, FiCheckCircle, FiEye, FiEyeOff, FiCalendar, FiMail, FiKey,
} from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useGetMeQuery, useUpdateProfileMutation } from '@/redux/api/userApi';
import { useUpdatePasswordMutation } from '@/redux/api/authApi';
import { useUploadMyImagesMutation } from '@/redux/api/uploadApi';
import { ROLE_LABEL, ROLE_HINT, ROLE_ACCESS, STAFF_ROLES, type StaffRole } from '@/components/admin/access';
import { toast } from 'react-hot-toast';

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
        <section className="rounded-xl border border-gray-200 bg-white">
            <header className="border-b border-gray-100 px-6 py-4">
                <h2 className="text-[15px] font-semibold text-gray-900">{title}</h2>
                {description && <p className="mt-0.5 text-sm text-gray-500">{description}</p>}
            </header>
            <div className="px-6 py-5">{children}</div>
            {footer && <footer className="flex items-center justify-end gap-3 rounded-b-xl border-t border-gray-100 bg-gray-50/60 px-6 py-3">{footer}</footer>}
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
    const [uploading, setUploading] = useState(false);

    const [profile, setProfile] = useState({ firstName: '', lastName: '', phone: '' });

    const [showPw, setShowPw] = useState(false);
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

    const dirty = !!user && (
        profile.firstName !== (user.firstName || '') ||
        profile.lastName !== (user.lastName || '') ||
        profile.phone !== (user.phone || '')
    );

    const pickAvatar = () => fileRef.current?.click();
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
        <div className="mx-auto max-w-6xl space-y-6">
            <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />

            <div>
                <h1 className="text-2xl font-semibold tracking-tight text-gray-900">My profile</h1>
                <p className="mt-1 text-sm text-gray-500">Your account details, sign-in and what you can open in the Karmo admin.</p>
            </div>

            <div className="grid items-start gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
                {/* ── Identity ── */}
                <aside className="overflow-hidden rounded-xl border border-gray-200 bg-white lg:sticky lg:top-20">
                    <div className="h-24 bg-[linear-gradient(135deg,var(--color-primary),color-mix(in_srgb,var(--color-primary)_55%,#111827))]" />
                    <div className="-mt-12 px-6 pb-6">
                        <div className="relative inline-block">
                            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-gray-900 text-2xl font-semibold text-white ring-4 ring-white">
                                {user?.avatar ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={user.avatar} alt={fullName} className="h-full w-full object-cover" />
                                ) : initials}
                            </div>
                            <button onClick={pickAvatar} disabled={uploading} aria-label="Change photo" title="Change photo" className="absolute bottom-0.5 right-0.5 flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:text-[var(--color-primary)] disabled:opacity-60">
                                {uploading ? <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-gray-300 border-t-[var(--color-primary)]" /> : <FiCamera size={14} />}
                            </button>
                        </div>

                        <h2 className="mt-3 truncate text-lg font-semibold text-gray-900">{fullName}</h2>
                        {user?.email && <p className="truncate text-sm text-gray-500">{user.email}</p>}

                        <div className="mt-3 flex flex-wrap gap-2">
                            <span className="inline-flex items-center gap-1 rounded-md bg-[var(--color-primary)]/10 px-2 py-1 text-xs font-medium text-[var(--color-primary)] ring-1 ring-inset ring-[var(--color-primary)]/20">
                                <FiShield size={12} /> {ROLE_LABEL[role] || role}
                            </span>
                            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium capitalize ring-1 ring-inset ${STATUS_STYLE[status] || STATUS_STYLE.active}`}>
                                {status}
                            </span>
                        </div>
                    </div>

                    <dl className="divide-y divide-gray-100 border-t border-gray-100 text-sm">
                        <div className="flex items-center justify-between gap-3 px-6 py-3">
                            <dt className="flex items-center gap-2 text-gray-500"><FiMail size={14} /> Email</dt>
                            <dd className={user?.isEmailVerified ? 'font-medium text-emerald-600' : 'text-gray-500'}>
                                {user?.isEmailVerified ? 'Verified' : 'Not verified'}
                            </dd>
                        </div>
                        <div className="flex items-center justify-between gap-3 px-6 py-3">
                            <dt className="flex items-center gap-2 text-gray-500"><FiCalendar size={14} /> Member since</dt>
                            <dd className="font-medium text-gray-900">{memberSince || '—'}</dd>
                        </div>
                    </dl>
                </aside>

                <div className="space-y-6">
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
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
                                <p className="mt-1.5 text-xs text-gray-500">Your login ID. Ask a super admin to change it.</p>
                            </div>
                        </div>
                    </Card>

                    {/* ── Sign-in & security ── */}
                    <Card title="Sign-in & security" description="How you sign in to the admin panel.">
                        <ul className="divide-y divide-gray-100 rounded-lg border border-gray-200">
                            <li className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5">
                                <div className="flex items-center gap-3">
                                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600"><FiKey size={15} /></span>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Password</p>
                                        <p className="text-xs text-gray-500">Email and password sign-in</p>
                                    </div>
                                </div>
                                {!showPw && (
                                    <button onClick={() => setShowPw(true)} className="h-8 rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
                                        Change password
                                    </button>
                                )}
                            </li>
                            <li className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5">
                                <div className="flex items-center gap-3">
                                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100"><FcGoogle size={17} /></span>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Google</p>
                                        <p className="text-xs text-gray-500">Sign in with your Gmail account</p>
                                    </div>
                                </div>
                                <span className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-500">Coming soon</span>
                            </li>
                        </ul>

                        {showPw && (
                            <div className="mt-5 rounded-lg border border-gray-200 p-5">
                                <div className="mb-4 flex items-center gap-2">
                                    <FiLock size={15} className="text-gray-500" />
                                    <h3 className="text-sm font-semibold text-gray-900">Change password</h3>
                                </div>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                    <div>
                                        <label className={labelCls}>Current password</label>
                                        <PasswordInput value={pw.currentPassword} onChange={(v) => setPw({ ...pw, currentPassword: v })} autoComplete="current-password" />
                                    </div>
                                    <div>
                                        <label className={labelCls}>New password</label>
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
                                        <label className={labelCls}>Confirm new password</label>
                                        <PasswordInput value={pw.confirmPassword} onChange={(v) => setPw({ ...pw, confirmPassword: v })} autoComplete="new-password" />
                                        {pw.confirmPassword && pw.newPassword !== pw.confirmPassword && (
                                            <p className="mt-1.5 text-xs font-medium text-red-600">Passwords do not match</p>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-5 flex justify-end gap-3">
                                    <button onClick={closePw} className="h-9 rounded-lg px-4 text-sm font-medium text-gray-600 transition hover:bg-gray-100">Cancel</button>
                                    <button onClick={handlePasswordChange} disabled={isChangingPw} className="h-9 rounded-lg bg-gray-900 px-4 text-sm font-medium text-white transition hover:bg-black disabled:opacity-50">
                                        {isChangingPw ? 'Updating…' : 'Update password'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </Card>

                    {/* ── Access ── */}
                    {staffRole && (
                        <Card title="Your access" description={ROLE_HINT[staffRole]}>
                            <ul className="space-y-2.5">
                                {ROLE_ACCESS[staffRole].map((line) => (
                                    <li key={line} className="flex items-start gap-2.5 text-sm text-gray-700">
                                        <FiCheckCircle size={15} className="mt-0.5 shrink-0 text-emerald-600" />
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
