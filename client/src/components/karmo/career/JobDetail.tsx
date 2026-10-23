"use client";

import Link from "next/link";
import {
    FiMapPin,
    FiBriefcase,
    FiClock,
    FiUsers,
    FiCalendar,
    FiDownload,
    FiArrowLeft,
    FiMail,
    FiPhone,
    FiHome,
} from "react-icons/fi";

import { useGetPublicJobQuery } from "@/redux/api/jobApi";
import ApplyForm from "./ApplyForm";
import {
    DIVISIONS,
    EMPLOYMENT_TYPES,
    WORKPLACE_TYPES,
    EXPERIENCE_LEVELS,
    labelOf,
    formatSalary,
    formatExperience,
    daysLeft,
} from "./careerConstants";

/**
 * One posting, with the application form beneath it.
 *
 * Long copy (`description`, `responsibilities`, …) is HTML written in the admin
 * rich-text editor, so it goes in through `dangerouslySetInnerHTML`. That is
 * safe here in a way it would not be for user-submitted text: only an
 * authenticated admin can ever write these fields.
 *
 * Every block is conditional. A posting with nothing but a title renders as a
 * clean short page rather than a run of empty headings.
 */

/** One row of the summary card: label left, value right. */
function Meta({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
    if (!value) return null;
    return (
        <div className="flex items-start justify-between gap-3 border-b border-ink/8 py-2.5 text-[13px] last:border-0">
            <span className="flex items-center gap-2 text-ink/50"><Icon className="text-[14px] text-ink/35" />{label}</span>
            <span className="text-right font-medium text-ink">{value}</span>
        </div>
    );
}

function Prose({ title, html }: { title: string; html?: string }) {
    if (!html || !html.trim()) return null;
    return (
        <div className="border-t border-ink/8 pt-5 first:border-0 first:pt-0">
            <h2 className="text-[13px] font-bold uppercase tracking-[0.12em] text-ink">{title}</h2>
            <div
                className="body-copy career-prose mt-2 text-[14px] leading-[1.75] text-ink/70"
                dangerouslySetInnerHTML={{ __html: html }}
            />
        </div>
    );
}

export default function JobDetail({ slug }: { slug: string }) {
    const { data, isLoading, isError } = useGetPublicJobQuery(slug);
    const job: any = data?.data;

    if (isLoading) {
        return (
            <div className="shell py-20">
                <div className="mx-auto h-8 w-2/3 animate-pulse rounded bg-cream" />
                <div className="mx-auto mt-4 h-64 animate-pulse rounded-lg bg-cream" />
            </div>
        );
    }

    if (isError || !job) {
        return (
            <div className="shell py-24 text-center">
                <h1 className="display text-[1.5rem] font-bold uppercase text-ink">
                    Position not found
                </h1>
                <p className="body-copy mx-auto mt-3 max-w-md text-[14.5px] text-ink/55">
                    This posting may have been filled or closed. Have a look at what else is open.
                </p>
                <Link
                    href="/career"
                    className="mt-6 inline-flex h-11 items-center gap-2 rounded-md bg-brand px-6 text-[12px] font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-brand-dark"
                >
                    <FiArrowLeft /> All openings
                </Link>
            </div>
        );
    }

    const left = daysLeft(job.deadline);
    const expired = left !== null && left < 0;
    const closed = job.acceptingApplications === false || expired;

    return (
        <>
            {/* ── Header: no banner — title, the key facts, apply ─────────────── */}
            <section className="border-b border-ink/8 bg-cream/40">
                <div className="shell pb-6 pt-10 lg:pb-7 lg:pt-12">
                    <Link
                        href="/career"
                        className="inline-flex items-center gap-1.5 text-[12px] font-medium text-ink/50 transition-colors hover:text-brand"
                    >
                        <FiArrowLeft /> All openings
                    </Link>

                    <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2 text-[10.5px] font-bold uppercase tracking-[0.16em]">
                                <span className="text-brand">{labelOf(DIVISIONS, job.division)}</span>
                                {job.department ? <span className="text-ink/35">· {job.department}</span> : null}
                                {job.isUrgent && <span className="rounded-sm bg-red-50 px-1.5 py-0.5 text-red-600">Urgent</span>}
                                {closed && <span className="rounded-sm bg-slate-100 px-1.5 py-0.5 text-slate-600">Closed</span>}
                            </div>
                            <h1 className="mt-1.5 text-[1.5rem] font-bold leading-tight text-ink lg:text-[1.85rem]">{job.title}</h1>
                            <ul className="mt-2.5 flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-ink/55">
                                {job.location ? <li className="flex items-center gap-1.5"><FiMapPin className="text-ink/35" />{job.location}</li> : null}
                                <li className="flex items-center gap-1.5"><FiBriefcase className="text-ink/35" />{labelOf(EMPLOYMENT_TYPES, job.employmentType)}</li>
                                {formatExperience(job) ? <li className="flex items-center gap-1.5"><FiClock className="text-ink/35" />{formatExperience(job)}</li> : null}
                                {left !== null && !expired ? <li className="flex items-center gap-1.5"><FiCalendar className="text-ink/35" />{left === 0 ? "Closes today" : `${left} day${left > 1 ? "s" : ""} left`}</li> : null}
                            </ul>
                        </div>
                        {!closed && (
                            <a
                                href="#apply"
                                className="inline-flex h-11 shrink-0 items-center justify-center self-start rounded-md bg-brand px-7 text-[12px] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-brand-dark lg:self-auto"
                            >
                                Apply now
                            </a>
                        )}
                    </div>
                </div>
            </section>

            {/* ── Body ───────────────────────────────────────────────────── */}
            <section className="bg-white py-7 lg:py-9">
                <div className="shell grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,18rem)] lg:gap-10">
                    <div className="min-w-0 space-y-5">
                        {job.summary ? <p className="body-copy text-[14.5px] leading-[1.75] text-ink/70">{job.summary}</p> : null}
                        <Prose title="About the role" html={job.description} />
                        <Prose title="Responsibilities" html={job.responsibilities} />
                        <Prose title="Requirements" html={job.requirements} />
                        <Prose title="Educational qualifications" html={job.education} />
                        <Prose title="Benefits" html={job.benefits} />

                        {job.skills?.length > 0 && (
                            <div className="border-t border-ink/8 pt-5">
                                <h2 className="text-[13px] font-bold uppercase tracking-[0.12em] text-ink">Skills</h2>
                                <ul className="mt-2.5 flex flex-wrap gap-1.5">
                                    {job.skills.map((sk: string) => (
                                        <li key={sk} className="rounded-md border border-ink/10 px-2.5 py-1 text-[12.5px] text-ink/70">{sk}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* ── Apply ──────────────────────────────────────── */}
                        <div id="apply" className="scroll-mt-[130px] border-t border-ink/8 pt-7">
                            <h2 className="text-[1.2rem] font-bold text-ink">Apply for this position</h2>
                            <p className="body-copy mt-1 text-[13.5px] text-ink/55">
                                No account needed — fill in your details and attach your CV.
                            </p>

                            <div className="mt-5">
                                {closed ? (
                                    <div className="rounded-lg border border-ink/12 bg-cream/40 p-6 text-center">
                                        <h3 className="display text-[1.1rem] font-bold uppercase text-ink">
                                            Applications are closed
                                        </h3>
                                        <p className="body-copy mx-auto mt-2 max-w-md text-[14px] text-ink/55">
                                            {expired
                                                ? "The deadline for this position has passed."
                                                : "This position is no longer accepting applications."}
                                        </p>
                                        <Link
                                            href="/career"
                                            className="mt-5 inline-flex h-11 items-center rounded-md bg-brand px-6 text-[12px] font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-brand-dark"
                                        >
                                            See other openings
                                        </Link>
                                    </div>
                                ) : (
                                    <ApplyForm job={job} />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── Sidebar ────────────────────────────────────────── */}
                    <aside className="lg:sticky lg:top-[130px] lg:self-start">
                        <div className="rounded-lg border border-ink/10 bg-white p-5">
                            <h2 className="text-[12px] font-bold uppercase tracking-[0.14em] text-ink">Job summary</h2>
                            <div className="mt-2">
                                <Meta icon={FiMapPin} label="Location" value={job.location} />
                                <Meta icon={FiBriefcase} label="Job type" value={labelOf(EMPLOYMENT_TYPES, job.employmentType)} />
                                <Meta icon={FiHome} label="Workplace" value={labelOf(WORKPLACE_TYPES, job.workplaceType)} />
                                <Meta icon={FiClock} label="Experience" value={formatExperience(job) || labelOf(EXPERIENCE_LEVELS, job.experienceLevel)} />
                                <Meta icon={FiUsers} label="Vacancies" value={job.vacancies ? String(job.vacancies) : ""} />
                                <Meta icon={FiBriefcase} label="Salary" value={formatSalary(job)} />
                                <Meta
                                    icon={FiCalendar}
                                    label="Application deadline"
                                    value={
                                        job.deadline
                                            ? new Date(job.deadline).toLocaleDateString("en-GB", {
                                                  day: "numeric",
                                                  month: "long",
                                                  year: "numeric",
                                              })
                                            : ""
                                    }
                                />
                            </div>

                            {!closed && (
                                <a
                                    href="#apply"
                                    className="mt-4 flex h-11 w-full items-center justify-center rounded-md bg-brand text-[12px] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-brand-dark"
                                >
                                    Apply now
                                </a>
                            )}

                            {job.jdFile ? (
                                <a
                                    href={job.jdFile}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-md border border-ink/15 text-[12px] font-bold uppercase tracking-[0.12em] text-ink transition-colors hover:border-brand hover:text-brand"
                                >
                                    <FiDownload /> Job description
                                </a>
                            ) : null}

                            {(job.contactEmail || job.contactPhone) && (
                                <div className="mt-4 border-t border-ink/10 pt-3.5">
                                    <p className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ink/40">
                                        Questions?
                                    </p>
                                    {job.contactEmail ? (
                                        <a href={`mailto:${job.contactEmail}`} className="mt-2 flex items-center gap-2 text-[13px] text-ink/70 hover:text-brand">
                                            <FiMail className="text-ink/40" /> {job.contactEmail}
                                        </a>
                                    ) : null}
                                    {job.contactPhone ? (
                                        <a href={`tel:${job.contactPhone}`} className="mt-1.5 flex items-center gap-2 text-[13px] text-ink/70 hover:text-brand">
                                            <FiPhone className="text-ink/40" /> {job.contactPhone}
                                        </a>
                                    ) : null}
                                </div>
                            )}
                        </div>
                    </aside>
                </div>
            </section>
        </>
    );
}
