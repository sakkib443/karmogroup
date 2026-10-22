"use client";

import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { LuArrowLeft, LuEye } from 'react-icons/lu';
import UserLayout from '@/components/user/UserLayout';
import AuthGuard from '@/components/shared/AuthGuard';
import { ADMIN_ROOT, ROLE_LABEL } from '@/components/admin/access';
import { canSwitch, setViewAs, useViewRole } from '@/components/admin/viewRole';

/**
 * Shown only to a super admin or admin who opened the shopper's dashboard from the
 * account menu — a real customer never sees it. One click goes back to their own panel.
 */
function StaffBackBar() {
    const router = useRouter();
    const { realRole } = useViewRole();
    if (!canSwitch(realRole)) return null;
    const mine = ROLE_LABEL[realRole || ''] || realRole;
    return (
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 border-b border-amber-200 bg-amber-50 px-4 py-2 text-[13px] text-amber-900 sm:px-6">
            <p className="flex items-center gap-2">
                <LuEye size={15} className="shrink-0" />
                <span>Viewing the <b className="font-semibold">Customer</b> dashboard <span className="hidden text-amber-800/80 sm:inline">— you are signed in as {mine}.</span></span>
            </p>
            <button
                type="button"
                onClick={() => { setViewAs(null); router.push(ADMIN_ROOT); }}
                className="inline-flex h-7 items-center gap-1.5 rounded-md border border-amber-300 bg-white px-2.5 text-xs font-medium text-amber-900 hover:bg-amber-100"
            >
                <LuArrowLeft size={13} /> Back to {mine}
            </button>
        </div>
    );
}

export default function UserDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthGuard>
            <StaffBackBar />
            {/* Suspense — UserLayout reads useSearchParams (cancellations tab highlight) */}
            <Suspense fallback={null}>
                <UserLayout>{children}</UserLayout>
            </Suspense>
        </AuthGuard>
    );
}
