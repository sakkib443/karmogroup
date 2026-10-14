"use client";

import RoleDashboard from '@/components/admin/dashboards/RoleDashboards';

// Same address for every staff role, a different page for each: the agency sees its call
// queue, the factory its scan queue, online sales the courier queue, and admins and
// managers the whole pipeline. See components/admin/dashboards/RoleDashboards.tsx.
export default function AdminPage() {
    return <RoleDashboard />;
}
