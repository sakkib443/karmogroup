import { Suspense } from "react";
import ApplicationsList from "@/components/admin/jobs/ApplicationsList";

/**
 * `/dashboard/admin/jobs/applications` — the CV inbox.
 *
 * Wrapped in Suspense because the list reads `?job=` with `useSearchParams`,
 * which Next requires a boundary for during prerender.
 */
export default function AdminApplicationsPage() {
    return (
        <Suspense fallback={<div className="p-6 text-slate-400">Loading…</div>}>
            <ApplicationsList />
        </Suspense>
    );
}
