"use client";

import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminRootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // TEMPORARY: AuthGuard removed so the panel opens without login. Restore
    // <AuthGuard requiredRole={['admin', 'editor']}> before going live.
    // Staff only: super admin, admin and editor. What each role may open is decided in
    // components/admin/access.ts (AdminLayout redirects away from anything else).
    return (
        <AdminLayout>{children}</AdminLayout>
    );
}
