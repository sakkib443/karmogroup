"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FiSearch, FiMapPin, FiBriefcase, FiClock, FiArrowUpRight, FiX } from "react-icons/fi";

import { useGetPublicJobsQuery } from "@/redux/api/jobApi";
import {
    DIVISIONS,
    EMPLOYMENT_TYPES,
    labelOf,
    formatSalary,
    formatExperience,
    daysLeft,
} from "./careerConstants";

/**
 * The public vacancy list: a short header with three filters, then the openings.
 *
 * Filtering runs on the server, not in the browser: the list is paginated, so
 * narrowing it client-side would only ever filter the page you happen to be on.
 */

const EMPTY = { search: "", division: "all", employmentType: "all", sort: "newest" };

const FIELD =
    "h-11 w-full rounded-md border border-ink/12 bg-white text-[13.5px] text-ink outline-none transition-colors focus:border-brand";

function deadlineText(left: number | null) {
    if (left === null) return { text: "", tone: "" };
    if (left < 0) return { text: "Closed", tone: "text-ink/40" };
    if (left === 0) return { text: "Closes today", tone: "text-red-600" };
    return { text: `${left} day${left > 1 ? "s" : ""} left`, tone: left <= 7 ? "text-amber-600" : "text-ink/45" };
}

function JobCard({ job }: { job: any }) {
    const salary = formatSalary(job);
    const experience = formatExperience(job);
    const due = deadlineText(daysLeft(job.deadline));

    return (
        <Link
            href={`/career/${job.slug}`}
            className="group flex flex-col rounded-lg border border-ink/10 bg-white p-5 transition-[border-color,box-shadow] duration-300 hover:border-brand/45 hover:shadow-[0_14px_34px_-26px_rgba(15,23,42,0.45)]"
        >
            <div className="flex items-start justify-between gap-3">
                <span className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-brand">
                    {labelOf(DIVISIONS, job.division)}
                    {job.department ? <span className="text-ink/35"> · {job.department}</span> : null}
                </span>
                {job.isUrgent ? (
                    <span className="shrink-0 rounded-sm bg-red-50 px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.12em] text-red-600">
                        Urgent
                    </span>
                ) : null}
            </div>

            <h3 className="mt-2 text-[16px] font-semibold leading-snug text-ink transition-colors group-hover:text-brand">
                {job.title}
            </h3>

            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[12.5px] text-ink/55">
                {job.location ? (
                    <li className="flex items-center gap-1.5"><FiMapPin className="text-ink/35" />{job.location}</li>
                ) : null}
                <li className="flex items-center gap-1.5"><FiBriefcase className="text-ink/35" />{labelOf(EMPLOYMENT_TYPES, job.employmentType)}</li>
                {experience ? (
                    <li className="flex items-center gap-1.5"><FiClock className="text-ink/35" />{experience}</li>
                ) : null}
            </ul>

            <div className="mt-auto pt-4">
                <div className="flex items-center justify-between gap-3 border-t border-ink/8 pt-3.5">
                    <span className="min-w-0 truncate text-[13px] font-semibold text-ink">
                        {salary || <span className="font-normal text-ink/40">Salary negotiable</span>}
                    </span>
                    <span className="flex shrink-0 items-center gap-2">
                        {due.text ? <span className={`text-[11.5px] ${due.tone}`}>{due.text}</span> : null}
                        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-ink/12 text-ink/50 transition-colors group-hover:border-brand group-hover:bg-brand group-hover:text-white">
                            <FiArrowUpRight className="text-[13px]" />
                        </span>
                    </span>
                </div>
            </div>
        </Link>
    );
}

export default function CareerList() {
    const [filters, setFilters] = useState(EMPTY);
    const [page, setPage] = useState(1);

    const set = (patch: Partial<typeof EMPTY>) => {
        setFilters((f) => ({ ...f, ...patch }));
        setPage(1);
    };
    const clear = () => { setFilters(EMPTY); setPage(1); };

    const params = useMemo(() => ({ ...filters, page, limit: 12 }), [filters, page]);
    const { data, isLoading, isError } = useGetPublicJobsQuery(params);

    const jobs: any[] = data?.data || [];
    const meta = data?.meta;
    const total = meta?.total ?? jobs.length;
    const hasFilters = filters.search !== "" || filters.division !== "all" || filters.employmentType !== "all";

    return (
        <>
            {/* ── Header: one line, a short note, three filters ─────────────── */}
            <section className="border-b border-ink/8 bg-cream/40">
                <div className="shell py-9 lg:py-11">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand">Careers</span>
                    <h1 className="display mt-2 text-[1.6rem] font-bold uppercase leading-tight text-ink lg:text-[2rem]">
                        Work with Karmo Group
                    </h1>
                    <p className="body-copy mt-2 max-w-xl text-[14px] leading-[1.7] text-ink/55">
                        Six decades of foam, mattress, HomeTex and chemicals — find your role and apply online in minutes.
                    </p>

                    <div className="mt-6 grid gap-2.5 sm:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)] lg:max-w-4xl">
                        <label className="relative block">
                            <span className="sr-only">Search</span>
                            <FiSearch className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[15px] text-ink/35" />
                            <input
                                type="search"
                                value={filters.search}
                                onChange={(e) => set({ search: e.target.value })}
                                placeholder="Job title or skill"
                                className={`${FIELD} pl-10 pr-3 placeholder:text-ink/40`}
                            />
                        </label>
                        <label className="block">
                            <span className="sr-only">Division</span>
                            <select value={filters.division} onChange={(e) => set({ division: e.target.value })} className={`${FIELD} cursor-pointer px-3`}>
                                <option value="all">All divisions</option>
                                {DIVISIONS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
                            </select>
                        </label>
                        <label className="block">
                            <span className="sr-only">Job type</span>
                            <select value={filters.employmentType} onChange={(e) => set({ employmentType: e.target.value })} className={`${FIELD} cursor-pointer px-3`}>
                                <option value="all">All job types</option>
                                {EMPLOYMENT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                            </select>
                        </label>
                    </div>
                </div>
            </section>

            {/* ── Openings ──────────────────────────────────────────────────── */}
            <section className="bg-white py-8 lg:py-10">
                <div className="shell">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-[13px]">
                        <p className="text-ink/55">
                            {isLoading ? "Loading openings…" : <><b className="font-semibold text-ink">{total}</b> open position{total === 1 ? "" : "s"}</>}
                            {hasFilters && !isLoading ? (
                                <button type="button" onClick={clear} className="ml-3 inline-flex items-center gap-1 text-brand hover:underline">
                                    <FiX /> Clear
                                </button>
                            ) : null}
                        </p>
                        <Link href="/career/track" className="font-medium text-ink/55 hover:text-brand">
                            Track your application →
                        </Link>
                    </div>

                    {isError ? (
                        <p className="rounded-lg border border-red-200 bg-red-50 p-5 text-center text-[14px] text-red-700">
                            Could not load openings right now. Please refresh and try again.
                        </p>
                    ) : isLoading ? (
                        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="h-44 animate-pulse rounded-lg border border-ink/8 bg-cream/40" />
                            ))}
                        </div>
                    ) : jobs.length === 0 ? (
                        <div className="rounded-lg border border-ink/10 bg-cream/30 px-6 py-10 text-center">
                            <p className="text-[15px] font-semibold text-ink">No openings match</p>
                            <p className="body-copy mx-auto mt-1 max-w-md text-[13.5px] text-ink/55">
                                {hasFilters ? "Try a different filter — new roles are posted regularly." : "There are no openings right now. Please check back soon."}
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                                {jobs.map((job) => <JobCard key={job._id} job={job} />)}
                            </div>

                            {meta && meta.totalPages > 1 && (
                                <div className="mt-6 flex items-center justify-center gap-2 text-[13px]">
                                    <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}
                                        className="h-9 rounded-md border border-ink/15 px-4 text-ink transition-colors hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-40">
                                        Previous
                                    </button>
                                    <span className="px-2 text-ink/55">{page} / {meta.totalPages}</span>
                                    <button type="button" disabled={page >= meta.totalPages} onClick={() => setPage((p) => p + 1)}
                                        className="h-9 rounded-md border border-ink/15 px-4 text-ink transition-colors hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-40">
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </>
    );
}
