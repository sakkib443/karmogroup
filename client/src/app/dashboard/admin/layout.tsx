"use client";

import AdminLayout from '@/components/admin/AdminLayout';
import AuthGuard from '@/components/shared/AuthGuard';

export default function AdminRootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Staff only — every staff role signs in here. What each role may open is decided in
    // components/admin/access.ts (AdminLayout redirects away from anything else), and the
    // server checks the same rules on every request.
    return (
        <AuthGuard requiredRole={['admin', 'manager', 'online_sales', 'agency', 'factory']}>
            <AdminLayout>{children}</AdminLayout>
        </AuthGuard>
    );
}
