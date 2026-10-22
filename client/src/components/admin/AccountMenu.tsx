'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { IconType } from 'react-icons';
import {
    LuBriefcase, LuCheck, LuChevronDown, LuCrown, LuFactory, LuLogOut, LuPhoneCall,
    LuShieldCheck, LuShoppingCart, LuUser, LuUserRound,
} from 'react-icons/lu';
import { ADMIN_ROOT, ROLE_LABEL } from './access';
import { setViewAs, switchableRoles, useViewRole } from './viewRole';

const ROLE_ICON: Record<string, IconType> = {
    superadmin: LuCrown,
    admin: LuShieldCheck,
    manager: LuBriefcase,
    online_sales: LuShoppingCart,
    agency: LuPhoneCall,
    factory: LuFactory,
    user: LuUser,
};

/**
 * The signed-in person at the top right. For a super admin or an admin it opens a
 * menu listing every dashboard they can switch to (see viewRole.ts); everyone else
 * gets the plain avatar. Choosing a role opens that role's dashboard.
 */
export default function AccountMenu({ name, initials, onLogout }: { name: string; initials: string; onLogout: () => void }) {
    const router = useRouter();
    const { realRole, role: viewRole } = useViewRole();
    const [open, setOpen] = useState(false);
    const box = useRef<HTMLDivElement>(null);
    const roles = switchableRoles(realRole);

    useEffect(() => {
        if (!open) return undefined;
        const onDown = (e: MouseEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false); };
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
        document.addEventListener('mousedown', onDown);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', onDown);
            document.removeEventListener('keydown', onKey);
        };
    }, [open]);

    const avatar = (
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-xs font-semibold text-gray-700">
            {initials}
        </span>
    );

    // Not a switcher: just who is signed in.
    if (roles.length === 0) {
        return (
            <span title={`${name}${realRole ? ` · ${ROLE_LABEL[realRole] || realRole}` : ''}`} className="ml-1 inline-flex">
                {avatar}
            </span>
        );
    }

    const pick = (r: string) => {
        setOpen(false);
        if (r === 'user') {
            router.push('/dashboard/user');
            return;
        }
        // Your own role is "no override"; anything else is a view of that role.
        setViewAs(r === realRole ? null : r);
        router.push(ADMIN_ROOT);
    };

    return (
        <div ref={box} className="relative ml-1">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={open}
                className={`flex h-9 items-center gap-2 rounded-full border bg-white pl-1 pr-2.5 transition-colors hover:bg-gray-50 ${open ? 'border-gray-300 bg-gray-50' : 'border-gray-200'}`}
            >
                {avatar}
                <span className="hidden max-w-[130px] flex-col items-start text-left leading-tight md:flex">
                    <span className="w-full truncate text-[13px] font-medium text-gray-900">{name}</span>
                    <span className="text-[11px] text-gray-500">
                        {ROLE_LABEL[viewRole || ''] || viewRole}{viewRole !== realRole ? ' view' : ''}
                    </span>
                </span>
                <LuChevronDown size={15} className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <div role="menu" className="absolute right-0 top-[calc(100%+8px)] z-50 w-[260px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-[0_12px_32px_-12px_rgba(15,23,42,0.28)]">
                    <div className="border-b border-gray-100 px-4 py-3">
                        <p className="truncate text-sm font-semibold text-gray-900">{name}</p>
                        <p className="mt-0.5 text-xs text-gray-500">Signed in as {ROLE_LABEL[realRole || ''] || realRole}</p>
                    </div>

                    <p className="px-4 pb-1 pt-3 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-gray-400">Switch dashboard</p>
                    <ul className="px-2 pb-2">
                        {roles.map((r) => {
                            const Icon = ROLE_ICON[r] || LuUserRound;
                            const current = r === viewRole;
                            return (
                                <li key={r}>
                                    <button
                                        type="button"
                                        role="menuitemradio"
                                        aria-checked={current}
                                        onClick={() => pick(r)}
                                        className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-sm transition-colors ${current ? 'bg-gray-100 font-medium text-gray-900' : 'text-gray-700 hover:bg-gray-50'}`}
                                    >
                                        <Icon size={16} className={current ? 'text-gray-900' : 'text-gray-400'} />
                                        <span className="flex-1">{ROLE_LABEL[r] || r}</span>
                                        {r === realRole ? <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500">You</span> : null}
                                        {current ? <LuCheck size={15} className="text-emerald-600" /> : null}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>

                    <div className="border-t border-gray-100 p-2">
                        <Link
                            href={`${ADMIN_ROOT}/profile`}
                            onClick={() => setOpen(false)}
                            className="flex h-9 items-center gap-3 rounded-lg px-2.5 text-sm text-gray-700 hover:bg-gray-50"
                        >
                            <LuUserRound size={16} className="text-gray-400" /> My profile
                        </Link>
                        <button
                            type="button"
                            onClick={() => { setOpen(false); onLogout(); }}
                            className="flex h-9 w-full items-center gap-3 rounded-lg px-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600"
                        >
                            <LuLogOut size={16} className="text-gray-400" /> Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
