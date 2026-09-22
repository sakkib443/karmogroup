"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
    LuSearch, LuDownload, LuStar, LuTrash2, LuX, LuFileText, LuExternalLink,
    LuMail, LuPhone, LuBriefcase, LuGraduationCap,
} from "react-icons/lu";

import {
    useGetApplicationsQuery,
    useGetApplicationStatsQuery,
    useGetJobsQuery,
    useUpdateApplicationMutation,
    useUpdateApplicationStatusMutation,
    useBulkUpdateApplicationsMutation,
    useDeleteApplicationMutation,
} from "@/redux/api/jobApi";
import { APPLICATION_STATUSES, STATUS_TONE } from "@/components/karmo/career/careerConstants";
import { API_URL } from "@/config/api";

/**
 * The CV inbox.
 *
 * Filtering and sorting run server-side; this screen only holds the query. The
 * detail drawer is a second query by id so the list stays light — a list row
 * carries what the table shows, not the full profile.
 */

const EMPTY = {
    search: "", job: "all", status: "all", sort: "newest",
    minExperience: "", maxExpectedSalary: "", from: "", to: "",
};

function Stat({ label, value, tone = "" }: any) {
    return (
        <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{label}</p>
            <p className={`mt-1 text-2xl font-bold ${tone || "text-slate-900"}`}>{value ?? 0}</p>
        </div>
    );
}

const input = "rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500";

function StatusPill({ status }: { status: string }) {
    const s = APPLICATION_STATUSES.find((x) => x.value === status);
    if (!s) return null;
    return (
        <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ring-1 ${STATUS_TONE[s.tone]}`}>
            {s.label}
        </span>
    );
}

/** Slide-over with the full candidate profile. */
function Detail({ id, onClose }: { id: string; onClose: () => void }) {
    const { data } = useGetApplicationsQuery({ limit: 1, search: "" }, { skip: true });
    const [update] = useUpdateApplicationMutation();
    const [app, setApp] = useState<any>(null);
    const [notes, setNotes] = useState("");

    /* Fetched directly rather than through RTK Query: this is a one-off read for
       a drawer that closes again, and caching it per-id would keep every CV the
       HR opened in memory for the session. */
    useEffect(() => {
        let alive = true;
        (async () => {
            const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
            const res = await fetch(`${API_URL}/applications/${id}`, {
                headers: token ? { authorization: `Bearer ${token}` } : {},
            });
            const json = await res.json();
            if (alive && json?.success) {
                setApp(json.data);
                setNotes(json.data.adminNotes || "");
            }
        })();
        return () => { alive = false; };
    }, [id]);

    if (!app) {
        return (
            <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
                <div className="h-full w-full max-w-2xl animate-pulse bg-white" />
            </div>
        );
    }

    const Row = ({ label, value }: any) =>
        value ? (
            <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{label}</dt>
                <dd className="mt-0.5 text-sm text-slate-800">{value}</dd>
            </div>
        ) : null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30" onClick={onClose}>
            <div className="h-full w-full max-w-2xl overflow-y-auto bg-white" onClick={(e) => e.stopPropagation()}>
                <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-200 bg-white px-6 py-4">
                    <div className="min-w-0">
                        <h2 className="truncate text-lg font-bold text-slate-900">{app.fullName}</h2>
                        <p className="mt-0.5 truncate text-sm text-slate-500">
                            {app.jobTitle} · {app.trackingId}
                        </p>
                    </div>
                    <button onClick={onClose} className="rounded p-2 text-slate-400 hover:bg-slate-100"><LuX size={18} /></button>
                </div>

                <div className="space-y-6 px-6 py-5">
                    <div className="flex flex-wrap gap-2">
                        {APPLICATION_STATUSES.map((s) => (
                            <button
                                key={s.value}
                                onClick={() => { update({ id, data: { status: s.value } }); setApp({ ...app, status: s.value }); }}
                                className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide ring-1 transition-all ${
                                    app.status === s.value ? STATUS_TONE[s.tone] : "bg-white text-slate-500 ring-slate-200 hover:ring-slate-400"
                                }`}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <a href={app.cvUrl} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-800">
                            <LuFileText size={15} /> Open CV
                        </a>
                        <a href={`mailto:${app.email}`} className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-300 px-4 text-sm text-slate-700 hover:border-slate-400">
                            <LuMail size={15} /> Email
                        </a>
                        <a href={`tel:${app.phone}`} className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-300 px-4 text-sm text-slate-700 hover:border-slate-400">
                            <LuPhone size={15} /> Call
                        </a>
                    </div>

                    <section>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Contact</h3>
                        <dl className="mt-3 grid gap-3 sm:grid-cols-2">
                            <Row label="Email" value={app.email} />
                            <Row label="Phone" value={app.phone} />
                            <Row label="District" value={app.district} />
                            <Row label="Date of birth" value={app.dateOfBirth ? new Date(app.dateOfBirth).toLocaleDateString("en-GB") : ""} />
                            <Row label="Gender" value={app.gender} />
                            <Row label="National ID" value={app.nationalId} />
                            <Row label="Present address" value={app.presentAddress} />
                            <Row label="Permanent address" value={app.permanentAddress} />
                        </dl>
                    </section>

                    <section>
                        <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                            <LuBriefcase size={13} /> Professional
                        </h3>
                        <dl className="mt-3 grid gap-3 sm:grid-cols-2">
                            <Row label="Current designation" value={app.currentDesignation} />
                            <Row label="Current company" value={app.currentCompany} />
                            <Row label="Experience" value={app.totalExperience != null ? `${app.totalExperience} yrs` : ""} />
                            <Row label="Notice period" value={app.noticePeriod} />
                            <Row label="Current salary" value={app.currentSalary ? `৳ ${app.currentSalary.toLocaleString("en-IN")}` : ""} />
                            <Row label="Expected salary" value={app.expectedSalary ? `৳ ${app.expectedSalary.toLocaleString("en-IN")}` : ""} />
                            <Row label="Available from" value={app.availableFrom ? new Date(app.availableFrom).toLocaleDateString("en-GB") : ""} />
                            <Row label="Skills" value={(app.skills || []).join(", ")} />
                        </dl>
                        {app.experiences?.length > 0 && (
                            <ul className="mt-3 space-y-2">
                                {app.experiences.map((e: any, i: number) => (
                                    <li key={i} className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
                                        <p className="font-medium text-slate-800">{e.designation} — {e.company}</p>
                                        <p className="text-xs text-slate-500">{e.duration}</p>
                                        {e.responsibilities ? <p className="mt-1 text-slate-600">{e.responsibilities}</p> : null}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>

                    {app.educations?.length > 0 && (
                        <section>
                            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                                <LuGraduationCap size={13} /> Education
                            </h3>
                            <ul className="mt-3 space-y-2">
                                {app.educations.map((e: any, i: number) => (
                                    <li key={i} className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
                                        <p className="font-medium text-slate-800">{e.degree} {e.field ? `— ${e.field}` : ""}</p>
                                        <p className="text-xs text-slate-500">{e.institution} {e.passingYear ? `· ${e.passingYear}` : ""} {e.result ? `· ${e.result}` : ""}</p>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {(app.coverLetterText || app.linkedinUrl || app.portfolioUrl || app.photoUrl || app.coverLetterUrl || app.portfolioFileUrl) && (
                        <section>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Attachments & links</h3>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {[
                                    { url: app.photoUrl, label: "Photo" },
                                    { url: app.coverLetterUrl, label: "Cover letter" },
                                    { url: app.portfolioFileUrl, label: "Portfolio" },
                                    { url: app.linkedinUrl, label: "LinkedIn" },
                                    { url: app.portfolioUrl, label: "Website" },
                                ].filter((x) => x.url).map((x) => (
                                    <a key={x.label} href={x.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-700 hover:border-slate-400">
                                        <LuExternalLink size={12} /> {x.label}
                                    </a>
                                ))}
                            </div>
                            {app.coverLetterText ? (
                                <p className="mt-3 whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                                    {app.coverLetterText}
                                </p>
                            ) : null}
                            {app.references ? (
                                <p className="mt-3 whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                                    <span className="font-medium">References: </span>{app.references}
                                </p>
                            ) : null}
                        </section>
                    )}

                    <section>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Internal notes</h3>
                        <textarea
                            rows={4}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            onBlur={() => update({ id, data: { adminNotes: notes } })}
                            placeholder="Interview feedback, call outcome…"
                            className="mt-2 w-full rounded-lg border border-slate-300 p-3 text-sm outline-none focus:border-slate-500"
                        />
                        <div className="mt-3 flex items-center gap-1">
                            <span className="mr-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Rating</span>
                            {[1, 2, 3, 4, 5].map((n) => (
                                <button key={n} onClick={() => { update({ id, data: { rating: n } }); setApp({ ...app, rating: n }); }} className="p-0.5">
                                    <LuStar size={18} className={n <= (app.rating || 0) ? "fill-amber-400 text-amber-400" : "text-slate-300"} />
                                </button>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default function ApplicationsList() {
    const searchParams = useSearchParams();
    const [filters, setFilters] = useState({ ...EMPTY, job: searchParams.get("job") || "all" });
    const [page, setPage] = useState(1);
    const [selected, setSelected] = useState<string[]>([]);
    const [openId, setOpenId] = useState<string | null>(null);

    const { data, isLoading } = useGetApplicationsQuery({ ...filters, page, limit: 20 });
    const { data: statsRes } = useGetApplicationStatsQuery(undefined);
    const { data: jobsRes } = useGetJobsQuery({ limit: 100 });
    const [updateStatus] = useUpdateApplicationStatusMutation();
    const [bulkUpdate] = useBulkUpdateApplicationsMutation();
    const [remove] = useDeleteApplicationMutation();

    const apps: any[] = data?.data || [];
    const meta = data?.meta;
    const stats = statsRes?.data || {};
    const jobs: any[] = jobsRes?.data || [];

    const set = (patch: any) => { setFilters((f) => ({ ...f, ...patch })); setPage(1); setSelected([]); };

    /* The export must carry the same filter the HR is looking at, and it needs
       the admin token — so it is a fetch + blob download, not a plain link. */
    const exportCsv = async () => {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const qs = new URLSearchParams(
            Object.entries(filters).filter(([, v]) => v && v !== "all") as [string, string][]
        ).toString();
        const res = await fetch(`${API_URL}/applications/export?${qs}`, {
            headers: token ? { authorization: `Bearer ${token}` } : {},
        });
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `karmo-applications-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const allChecked = apps.length > 0 && selected.length === apps.length;

    return (
        <div className="p-4 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Applications</h1>
                    <p className="mt-0.5 text-sm text-slate-500">CVs received from the career page</p>
                </div>
                <button onClick={exportCsv} className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-300 px-4 text-sm font-medium text-slate-700 hover:border-slate-400">
                    <LuDownload size={15} /> Export CSV
                </button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
                <Stat label="Total" value={stats.total} />
                <Stat label="Today" value={stats.today} tone="text-blue-600" />
                <Stat label="New" value={stats.new} tone="text-amber-600" />
                <Stat label="Shortlisted" value={stats.shortlisted} tone="text-blue-700" />
                <Stat label="Interview" value={stats.interview} tone="text-violet-600" />
                <Stat label="Hired" value={stats.hired} tone="text-green-600" />
            </div>

            {/* Filters */}
            <div className="mt-5 flex flex-wrap gap-3">
                <div className="relative min-w-[220px] flex-1">
                    <LuSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input value={filters.search} onChange={(e) => set({ search: e.target.value })} placeholder="Name, email, phone, tracking ID, skill…" className={`${input} w-full pl-9`} />
                </div>
                <select value={filters.job} onChange={(e) => set({ job: e.target.value })} className={input}>
                    <option value="all">All jobs</option>
                    {jobs.map((j) => <option key={j._id} value={j._id}>{j.title}</option>)}
                </select>
                <select value={filters.status} onChange={(e) => set({ status: e.target.value })} className={input}>
                    <option value="all">All statuses</option>
                    {APPLICATION_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
                <select value={filters.sort} onChange={(e) => set({ sort: e.target.value })} className={input}>
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="rating">Top rated</option>
                    <option value="experience">Most experienced</option>
                    <option value="salary">Lowest expected salary</option>
                </select>
                <input type="number" min={0} value={filters.minExperience} onChange={(e) => set({ minExperience: e.target.value })} placeholder="Min exp (yrs)" className={`${input} w-36`} />
                <input type="date" value={filters.from} onChange={(e) => set({ from: e.target.value })} className={input} title="From date" />
                <input type="date" value={filters.to} onChange={(e) => set({ to: e.target.value })} className={input} title="To date" />
            </div>

            {selected.length > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-3 rounded-lg border border-slate-300 bg-slate-50 px-4 py-3">
                    <span className="text-sm font-medium text-slate-700">{selected.length} selected</span>
                    <select
                        onChange={async (e) => {
                            if (!e.target.value) return;
                            await bulkUpdate({ ids: selected, status: e.target.value });
                            setSelected([]);
                            e.target.value = "";
                        }}
                        className={input}
                        defaultValue=""
                    >
                        <option value="">Move to…</option>
                        {APPLICATION_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                    <button onClick={() => setSelected([])} className="text-sm text-slate-500 hover:text-slate-900">Clear</button>
                </div>
            )}

            {/* Table */}
            <div className="mt-5 overflow-x-auto rounded-lg border border-slate-200 bg-white">
                <table className="w-full min-w-[900px] text-sm">
                    <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
                        <tr>
                            <th className="w-10 px-4 py-3">
                                <input type="checkbox" checked={allChecked} onChange={(e) => setSelected(e.target.checked ? apps.map((a) => a._id) : [])} className="h-4 w-4 rounded" />
                            </th>
                            <th className="px-4 py-3 font-semibold">Candidate</th>
                            <th className="px-4 py-3 font-semibold">Position</th>
                            <th className="px-4 py-3 font-semibold">Experience</th>
                            <th className="px-4 py-3 font-semibold">Expected</th>
                            <th className="px-4 py-3 font-semibold">Applied</th>
                            <th className="px-4 py-3 font-semibold">Status</th>
                            <th className="px-4 py-3 text-right font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {isLoading ? (
                            <tr><td colSpan={8} className="px-4 py-10 text-center text-slate-400">Loading…</td></tr>
                        ) : apps.length === 0 ? (
                            <tr><td colSpan={8} className="px-4 py-12 text-center text-slate-500">No applications match this filter.</td></tr>
                        ) : (
                            apps.map((a) => (
                                <tr key={a._id} className="hover:bg-slate-50">
                                    <td className="px-4 py-3">
                                        <input type="checkbox" checked={selected.includes(a._id)} onChange={(e) => setSelected((s) => e.target.checked ? [...s, a._id] : s.filter((x) => x !== a._id))} className="h-4 w-4 rounded" />
                                    </td>
                                    <td className="px-4 py-3">
                                        <button onClick={() => setOpenId(a._id)} className="text-left">
                                            <p className="font-medium text-slate-900 hover:underline">{a.fullName}</p>
                                            <p className="mt-0.5 text-xs text-slate-500">{a.email} · {a.phone}</p>
                                        </button>
                                    </td>
                                    <td className="px-4 py-3 text-slate-600">{a.job?.title || a.jobTitle}</td>
                                    <td className="px-4 py-3 text-slate-600">{a.totalExperience != null ? `${a.totalExperience} yrs` : "—"}</td>
                                    <td className="px-4 py-3 text-slate-600">{a.expectedSalary ? `৳ ${a.expectedSalary.toLocaleString("en-IN")}` : "—"}</td>
                                    <td className="px-4 py-3 text-slate-600">{new Date(a.createdAt).toLocaleDateString("en-GB")}</td>
                                    <td className="px-4 py-3">
                                        <select
                                            value={a.status}
                                            onChange={(e) => updateStatus({ id: a._id, status: e.target.value })}
                                            className="cursor-pointer rounded-full border border-slate-200 px-2.5 py-1 text-xs font-semibold outline-none"
                                        >
                                            {APPLICATION_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                                        </select>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-1">
                                            <a href={a.cvUrl} target="_blank" rel="noopener noreferrer" title="Open CV" className="rounded p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900">
                                                <LuFileText size={15} />
                                            </a>
                                            <button title="Delete" onClick={() => { if (window.confirm(`Delete ${a.fullName}'s application?`)) remove(a._id); }} className="rounded p-2 text-slate-500 hover:bg-red-50 hover:text-red-600">
                                                <LuTrash2 size={15} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
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

            {openId ? <Detail id={openId} onClose={() => setOpenId(null)} /> : null}
        </div>
    );
}
