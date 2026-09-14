"use client";

import { useState } from "react";
import Link from "next/link";
import {
    LuPlus, LuSearch, LuCopy, LuTrash2, LuPencil, LuUsers, LuEye, LuExternalLink,
} from "react-icons/lu";

import {
    useGetJobsQuery,
    useGetJobStatsQuery,
    useUpdateJobStatusMutation,
    useDuplicateJobMutation,
    useDeleteJobMutation,
} from "@/redux/api/jobApi";
import {
    DIVISIONS, JOB_STATUSES, EMPLOYMENT_TYPES, labelOf, daysLeft,
} from "@/components/karmo/career/careerConstants";

/**
 * Admin list of postings.
 *
 * The status dropdown writes straight through rather than opening an edit
 * screen — moving a role between draft, published and closed is the action HR
 * takes most often, and it should not cost a page load.
 */

const STATUS_STYLE: Record<string, string> = {
    draft: "bg-slate-100 text-slate-700",
    published: "bg-green-100 text-green-700",
    closed: "bg-red-100 text-red-700",
};

function Stat({ label, value, tone = "" }: { label: string; value: number; tone?: string }) {
    return (
        <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{label}</p>
            <p className={`mt-1 text-2xl font-bold ${tone || "text-slate-900"}`}>{value ?? 0}</p>
        </div>
    );
}

export default function JobsList() {
    const [filters, setFilters] = useState({ search: "", status: "all", division: "all" });
    const [page, setPage] = useState(1);

    const { data, isLoading } = useGetJobsQuery({ ...filters, page, limit: 20 });
    const { data: statsRes } = useGetJobStatsQuery(undefined);
    const [updateStatus] = useUpdateJobStatusMutation();
    const [duplicate] = useDuplicateJobMutation();
    const [remove] = useDeleteJobMutation();

    const jobs: any[] = data?.data || [];
    const meta = data?.meta;
    const stats = statsRes?.data || {};

    const set = (patch: Partial<typeof filters>) => {
        setFilters((f) => ({ ...f, ...patch }));
        setPage(1);
    };

    const onDelete = async (job: any) => {
        /* Applications go with the posting — say so before it happens, because
           there is no undo and the CVs are the valuable half. */
        const count = job.applicationCount || 0;
        const warning = count
            ? `Delete "${job.title}"?\n\nThis also permanently deletes ${count} application${count > 1 ? "s" : ""} and their CVs.`
            : `Delete "${job.title}"?`;
        if (!window.confirm(warning)) return;
        await remove(job._id);
    };

    return (
        <div className="p-4 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Jobs</h1>
                    <p className="mt-0.5 text-sm text-slate-500">
                        Postings on the public career page
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link
                        href="/career"
                        target="_blank"
                        className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-300 px-4 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400"
                    >
                        <LuExternalLink size={15} /> View page
                    </Link>
                    <Link
                        href="/dashboard/admin/jobs/new"
                        className="inline-flex h-10 items-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                    >
                        <LuPlus size={16} /> Post a job
                    </Link>
                </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                <Stat label="Total jobs" value={stats.total} />
                <Stat label="Published" value={stats.published} tone="text-green-600" />
                <Stat label="Draft" value={stats.draft} tone="text-slate-500" />
                <Stat label="Applications" value={stats.applications} tone="text-blue-600" />
                <Stat label="New CVs" value={stats.newApplications} tone="text-amber-600" />
            </div>

            {/* Filters */}
            <div className="mt-5 flex flex-wrap gap-3">
                <div className="relative min-w-[220px] flex-1">
                    <LuSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        value={filters.search}
                        onChange={(e) => set({ search: e.target.value })}
                        placeholder="Search title, department, skill…"
                        className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-slate-500"
                    />
                </div>
                <select
                    value={filters.status}
                    onChange={(e) => set({ status: e.target.value })}
                    className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                >
                    <option value="all">All statuses</option>
                    {JOB_STATUSES.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                </select>
                <select
                    value={filters.division}
                    onChange={(e) => set({ division: e.target.value })}
                    className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                >
                    <option value="all">All divisions</option>
                    {DIVISIONS.map((d) => (
                        <option key={d.value} value={d.value}>{d.label}</option>
                    ))}
                </select>
            </div>

            {/* Table */}
            <div className="mt-5 overflow-x-auto rounded-lg border border-slate-200 bg-white">
                <table className="w-full min-w-[860px] text-sm">
                    <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
                        <tr>
                            <th className="px-4 py-3 font-semibold">Position</th>
                            <th className="px-4 py-3 font-semibold">Division</th>
                            <th className="px-4 py-3 font-semibold">Type</th>
                            <th className="px-4 py-3 font-semibold">Deadline</th>
                            <th className="px-4 py-3 text-center font-semibold">CVs</th>
                            <th className="px-4 py-3 font-semibold">Status</th>
                            <th className="px-4 py-3 text-right font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {isLoading ? (
                            <tr><td colSpan={7} className="px-4 py-10 text-center text-slate-400">Loading…</td></tr>
                        ) : jobs.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-4 py-12 text-center">
                                    <p className="font-medium text-slate-700">No jobs yet</p>
                                    <p className="mt-1 text-slate-500">Post your first opening to see it on the career page.</p>
                                    <Link href="/dashboard/admin/jobs/new" className="mt-4 inline-flex h-9 items-center rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white">
                                        Post a job
                                    </Link>
                                </td>
                            </tr>
                        ) : (
                            jobs.map((job) => {
                                const left = daysLeft(job.deadline);
                                return (
                                    <tr key={job._id} className="hover:bg-slate-50">
                                        <td className="px-4 py-3">
                                            <p className="font-medium text-slate-900">{job.title}</p>
                                            <p className="mt-0.5 flex items-center gap-2 text-xs text-slate-500">
                                                {job.department || "—"}
                                                <span className="inline-flex items-center gap-1"><LuEye size={12} />{job.views || 0}</span>
                                            </p>
                                        </td>
                                        <td className="px-4 py-3 text-slate-600">{labelOf(DIVISIONS, job.division)}</td>
                                        <td className="px-4 py-3 text-slate-600">{labelOf(EMPLOYMENT_TYPES, job.employmentType)}</td>
                                        <td className="px-4 py-3">
                                            {job.deadline ? (
                                                <span className={left != null && left < 0 ? "text-red-600" : "text-slate-600"}>
                                                    {new Date(job.deadline).toLocaleDateString("en-GB")}
                                                </span>
                                            ) : <span className="text-slate-400">—</span>}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <Link
                                                href={`/dashboard/admin/jobs/applications?job=${job._id}`}
                                                className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                                            >
                                                <LuUsers size={12} /> {job.applicationCount || 0}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3">
                                            <select
                                                value={job.status}
                                                onChange={(e) => updateStatus({ id: job._id, status: e.target.value })}
                                                className={`cursor-pointer rounded-full px-2.5 py-1 text-xs font-semibold outline-none ${STATUS_STYLE[job.status] || ""}`}
                                            >
                                                {JOB_STATUSES.map((s) => (
                                                    <option key={s.value} value={s.value}>{s.label}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link href={`/dashboard/admin/jobs/${job._id}`} title="Edit" className="rounded p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900">
                                                    <LuPencil size={15} />
                                                </Link>
                                                <button type="button" title="Duplicate" onClick={() => duplicate(job._id)} className="rounded p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900">
                                                    <LuCopy size={15} />
                                                </button>
                                                <button type="button" title="Delete" onClick={() => onDelete(job)} className="rounded p-2 text-slate-500 hover:bg-red-50 hover:text-red-600">
                                                    <LuTrash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {meta && meta.totalPages > 1 && (
                <div className="mt-4 flex items-center justify-center gap-2">
                    <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="h-9 rounded-lg border border-slate-300 px-4 text-sm disabled:opacity-40">Previous</button>
                    <span className="px-2 text-sm text-slate-600">{page} / {meta.totalPages}</span>
                    <button disabled={page >= meta.totalPages} onClick={() => setPage((p) => p + 1)} className="h-9 rounded-lg border border-slate-300 px-4 text-sm disabled:opacity-40">Next</button>
                </div>
            )}
        </div>
    );
}
