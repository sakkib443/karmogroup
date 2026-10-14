/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

/**
 * Adding and managing accounts — shared by Users, Customers and a person's page.
 * The super admin manages everyone; an admin manages customers and the staff below
 * admin (access.ts → assignableRoles). The server checks the same in user.service.ts.
 */
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { LuEye, LuEyeOff } from 'react-icons/lu';
import { RootState } from '@/redux/store';
import { useCreateUserMutation, useUpdateUserMutation, useDeleteUserMutation } from '@/redux/api/userApi';
import { ROLE_HINT, ROLE_LABEL, assignableRoles, type StaffRole } from '@/components/admin/access';
import { Btn, Modal, Field, INPUT, Toggle, cx, type Tone } from '@/components/admin/ui';

export const STATUS_TONE: Record<string, Tone> = { active: 'green', blocked: 'red', pending: 'amber' };
export const ROLE_TONE: Record<string, Tone> = {
    superadmin: 'rose', admin: 'purple', manager: 'indigo', online_sales: 'blue', agency: 'orange', factory: 'teal', user: 'gray',
};
export const DIVISIONS = [
    { key: 'foam', label: 'Foam' },
    { key: 'mattress', label: 'Mattress' },
    { key: 'fiber_pillow', label: 'Fiber Pillow' },
    { key: 'hometex', label: 'Hometex' },
    { key: 'chemicals', label: 'Chemicals' },
];

export const fullNameOf = (u: any) =>
    `${u?.firstName || ''} ${u?.lastName || ''}`.replace(/\s\.$/, '').trim() || u?.email || '—';

export const errMsg = (err: any, fallback: string) =>
    err?.data?.errorMessages?.[0]?.message || err?.data?.message || fallback;

const roleHint = (r: string) => (r === 'user' ? 'Shops on the website. No access to this dashboard.' : ROLE_HINT[r as StaffRole]);

type Form = {
    role: string; firstName: string; lastName: string; email: string; phone: string; password: string;
    divisions: string[]; status: string; isEmailVerified: boolean; loyaltyPoints: string; defaultDiscount: string;
};

const fromUser = (u: any, fallbackRole: string): Form => ({
    role: u?.role || fallbackRole,
    firstName: u?.firstName || '',
    lastName: u?.lastName && u.lastName !== '.' ? u.lastName : '',
    email: u?.email || '',
    phone: u?.phone || '',
    password: '',
    divisions: u?.divisions || [],
    status: u?.status || 'active',
    isEmailVerified: u?.isEmailVerified ?? true,
    loyaltyPoints: String(u?.loyaltyPoints ?? 0),
    defaultDiscount: String(u?.defaultDiscount ?? 0),
});

/**
 * Add an account (no `user`) or change one (`user`): name, email, phone, role, divisions,
 * status and a new password. Mount it only while open so it starts from the person's data.
 */
export function UserFormModal({ user, defaultRole = 'user', onClose, onSaved }: {
    user?: any; defaultRole?: string; onClose: () => void; onSaved?: (u: any) => void;
}) {
    const me = useSelector((s: RootState) => s.auth.user);
    const canGive = assignableRoles(me?.role);
    const isEdit = !!user;
    const isSelf = isEdit && user._id === me?.id;
    const [form, setForm] = useState<Form>(() => fromUser(user, canGive.includes(defaultRole) ? defaultRole : canGive[0] || 'user'));
    const [showPw, setShowPw] = useState(false);
    const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
    const busy = isCreating || isUpdating;

    const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));
    const toggleDivision = (key: string) =>
        set('divisions', form.divisions.includes(key) ? form.divisions.filter((d) => d !== key) : [...form.divisions, key]);

    // Your own role and status stay as they are, so nobody locks themselves out.
    const roleChoices = isSelf ? [form.role] : canGive;

    const save = async () => {
        if (!form.firstName.trim() || !form.email.trim()) { toast.error('Name and email are required'); return; }
        if (!isEdit && !form.password) { toast.error('Set a password'); return; }
        if (form.password && form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
        const isCustomer = form.role === 'user';
        const points = Number(form.loyaltyPoints || 0);
        const discount = Number(form.defaultDiscount || 0);
        if (isCustomer && (!Number.isInteger(points) || points < 0)) { toast.error('Points must be a whole number, 0 or more'); return; }
        if (isCustomer && !(discount >= 0 && discount <= 100)) { toast.error('Discount must be between 0 and 100%'); return; }

        try {
            if (isEdit) {
                const body: any = {
                    id: user._id,
                    firstName: form.firstName.trim(),
                    lastName: form.lastName.trim(),
                    email: form.email.trim(),
                    phone: form.phone.trim(),
                    isEmailVerified: form.isEmailVerified,
                };
                if (!isSelf) { body.role = form.role; body.status = form.status; }
                if (form.role === 'factory') body.divisions = form.divisions;
                if (isCustomer) { body.loyaltyPoints = points; body.defaultDiscount = discount; }
                if (form.password) body.password = form.password;
                const res: any = await updateUser(body).unwrap();
                toast.success(form.password ? 'Saved — new password set' : 'Saved');
                onSaved?.(res?.data);
            } else {
                const res: any = await createUser({
                    firstName: form.firstName.trim(),
                    lastName: form.lastName.trim() || undefined,
                    email: form.email.trim(),
                    phone: form.phone.trim() || undefined,
                    password: form.password,
                    role: form.role,
                    divisions: form.role === 'factory' ? form.divisions : undefined,
                    status: form.status,
                }).unwrap();
                toast.success(`${ROLE_LABEL[form.role] || 'Account'} created`);
                onSaved?.(res?.data);
            }
            onClose();
        } catch (err: any) {
            toast.error(errMsg(err, isEdit ? 'Could not save the changes' : 'Could not create the account'));
        }
    };

    return (
        <Modal
            open
            onClose={onClose}
            title={isEdit ? `Edit ${fullNameOf(user)}` : 'Add user'}
            subtitle={roleHint(form.role)}
            width="max-w-xl"
            footer={<>
                <Btn onClick={onClose}>Cancel</Btn>
                <Btn variant="primary" onClick={save} disabled={busy}>
                    {busy ? 'Saving…' : isEdit ? 'Save changes' : `Create ${(ROLE_LABEL[form.role] || 'account').toLowerCase()}`}
                </Btn>
            </>}
        >
            <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Role" required className="sm:col-span-2" hint={isSelf ? 'You cannot change your own role.' : undefined}>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {roleChoices.map((r) => (
                            <button key={r} type="button" disabled={isSelf} onClick={() => set('role', r)}
                                className={cx('rounded-xl border px-3 py-2 text-left text-sm transition disabled:cursor-default',
                                    form.role === r ? 'border-[var(--color-primary)] bg-[var(--color-primary-lightest)] font-semibold text-gray-900' : 'border-gray-200 text-gray-700 hover:bg-gray-50')}>
                                {ROLE_LABEL[r] || r}
                            </button>
                        ))}
                    </div>
                </Field>

                {form.role === 'factory' && (
                    <Field label="Divisions" hint="Which factories this person works in. None selected = all divisions." className="sm:col-span-2">
                        <div className="flex flex-wrap gap-2">
                            {DIVISIONS.map((d) => (
                                <button key={d.key} type="button" onClick={() => toggleDivision(d.key)}
                                    className={cx('rounded-full border px-3 py-1.5 text-sm transition',
                                        form.divisions.includes(d.key) ? 'border-teal-500 bg-teal-50 font-medium text-teal-800' : 'border-gray-200 text-gray-600 hover:bg-gray-50')}>
                                    {d.label}
                                </button>
                            ))}
                        </div>
                    </Field>
                )}

                <Field label="First name" required>
                    <input className={INPUT} value={form.firstName} autoFocus={!isEdit} onChange={(e) => set('firstName', e.target.value)} />
                </Field>
                <Field label="Last name">
                    <input className={INPUT} value={form.lastName} onChange={(e) => set('lastName', e.target.value)} />
                </Field>
                <Field label="Email" required className="sm:col-span-2" hint="They sign in with this.">
                    <input className={INPUT} type="email" value={form.email} onChange={(e) => set('email', e.target.value)} />
                </Field>
                <Field label="Phone">
                    <input className={INPUT} inputMode="tel" placeholder="01XXXXXXXXX" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
                </Field>
                <Field
                    label={isEdit ? 'New password' : 'Password'}
                    required={!isEdit}
                    hint={isEdit ? 'Leave empty to keep the current password.' : 'At least 6 characters.'}
                >
                    <div className="relative">
                        <input className={cx(INPUT, 'pr-10')} type={showPw ? 'text' : 'password'} autoComplete="new-password"
                            value={form.password} onChange={(e) => set('password', e.target.value)} />
                        <button type="button" onClick={() => setShowPw((s) => !s)} aria-label={showPw ? 'Hide password' : 'Show password'}
                            className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-gray-400 hover:text-gray-700">
                            {showPw ? <LuEyeOff size={16} /> : <LuEye size={16} />}
                        </button>
                    </div>
                    {form.email.trim().length >= 6 && (
                        <button type="button" onClick={() => { set('password', form.email.trim()); setShowPw(true); }}
                            className="mt-1 text-xs font-medium text-[var(--color-primary)] hover:underline">
                            Use the email as password
                        </button>
                    )}
                </Field>

                {form.role === 'user' && (<>
                    <Field label="Loyalty points">
                        <input className={INPUT} type="number" min={0} step={1} value={form.loyaltyPoints} onChange={(e) => set('loyaltyPoints', e.target.value)} />
                    </Field>
                    <Field label="Default discount (%)">
                        <input className={INPUT} type="number" min={0} max={100} step="0.5" value={form.defaultDiscount} onChange={(e) => set('defaultDiscount', e.target.value)} />
                    </Field>
                </>)}

                {!isSelf && (
                    <Field label="Status" className="sm:col-span-2" hint="A blocked account is signed out at once and cannot sign in.">
                        <div className="grid grid-cols-2 gap-2 sm:w-72">
                            {[{ v: 'active', t: 'Active' }, { v: 'blocked', t: 'Blocked' }].map((s) => (
                                <button key={s.v} type="button" onClick={() => set('status', s.v)}
                                    className={cx('rounded-xl border px-3 py-2 text-sm transition',
                                        form.status === s.v
                                            ? s.v === 'blocked' ? 'border-red-300 bg-red-50 font-semibold text-red-700' : 'border-emerald-300 bg-emerald-50 font-semibold text-emerald-700'
                                            : 'border-gray-200 text-gray-700 hover:bg-gray-50')}>
                                    {s.t}
                                </button>
                            ))}
                        </div>
                    </Field>
                )}
                {isEdit && (
                    <div className="sm:col-span-2">
                        <Toggle checked={form.isEmailVerified} onChange={(v) => set('isEmailVerified', v)} label="Email verified" />
                    </div>
                )}
            </div>
        </Modal>
    );
}

/** Block / unblock and delete, with the questions asked first. */
export function useUserActions() {
    const [updateUser] = useUpdateUserMutation();
    const [deleteUser] = useDeleteUserMutation();

    const toggleBlock = async (u: any) => {
        const next = u.status === 'blocked' ? 'active' : 'blocked';
        const name = fullNameOf(u);
        const ask = next === 'blocked'
            ? `Block ${name}? They are signed out at once and cannot sign in until unblocked.`
            : `Unblock ${name}? They can sign in again.`;
        if (!window.confirm(ask)) return false;
        try {
            await updateUser({ id: u._id, status: next }).unwrap();
            toast.success(next === 'blocked' ? `${name} blocked` : `${name} unblocked`);
            return true;
        } catch (err: any) {
            toast.error(errMsg(err, 'Could not change the status'));
            return false;
        }
    };

    const remove = async (u: any) => {
        const name = fullNameOf(u);
        if (!window.confirm(`Delete ${name} (${u.email})?\n\nThey are signed out at once and can no longer sign in. Their orders stay on record. The same email can be used for a new account later.`)) return false;
        try {
            await deleteUser(u._id).unwrap();
            toast.success(`${name} deleted`);
            return true;
        } catch (err: any) {
            toast.error(errMsg(err, 'Could not delete the account'));
            return false;
        }
    };

    return { toggleBlock, remove };
}
