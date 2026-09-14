"use client";

import Link from "next/link";
import Image from "next/image";
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

function Meta({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
    if (!value) return null;
    return (
        <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-brand/8 text-brand">
                <Icon className="text-[15px]" />
            </span>
            <span className="min-w-0">
                <span className="block text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ink/40">
                    {label}
                </span>
                <span className="mt-0.5 block text-[13.5px] font-medium text-ink">{value}</span>
            </span>
        </div>
    );
}

function Prose({ title, html }: { title: string; html?: string }) {
    if (!html || !html.trim()) return null;
    return (
        <div className="mt-8">
            <h2 className="display text-[1.05rem] font-bold uppercase tracking-[0.04em] text-ink">
                {title}
            </h2>
            <div
                className="body-copy career-prose mt-3 text-[14.5px] leading-[1.8] text-ink/70"
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
            {/* ── Header ─────────────────────────────────────────────────── */}
            <section className="relative border-b border-ink/8 bg-cream/40">
                {job.bannerImage ? (
                    <div className="relative h-48 w-full overflow-hidden sm:h-64 lg:h-72">
                        <Image src={job.bannerImage} alt={job.title} fill sizes="100vw" className="object-cover" priority />
                        <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/60 to-ink/10" />
                    </div>
                ) : null}

                <div className="shell py-8 lg:py-10">
                    <Link
                        href="/career"
                        className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.1em] text-ink/50 transition-colors hover:text-brand"
                    >
                        <FiArrowLeft /> All openings
                    </Link>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-brand/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-brand">
                            {labelOf(DIVISIONS, job.division)}
                        </span>
                        {job.isUrgent && (
                            <span className="rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-red-600 ring-1 ring-red-200">
                                Urgent hiring
                            </span>
                        )}
                        {closed && (
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-600 ring-1 ring-slate-200">
                                Closed
                            </span>
                        )}
                    </div>

                    <h1 className="display section-heading mt-3 uppercase text-ink">{job.title}</h1>
                    {job.department ? (
                        <p className="mt-2 text-[14px] text-ink/55">{job.department}</p>
                    ) : null}
                    {job.summary ? (
                        <p className="body-copy mt-4 max-w-3xl text-[15px] leading-[1.75] text-ink/60">
                            {job.summary}
                        </p>
                    ) : null}
                </div>
            </section>

            {/* ── Body ───────────────────────────────────────────────────── */}
            <section className="bg-white py-10 lg:py-14">
                <div className="shell grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:gap-12">
                    <div className="min-w-0">
                        <Prose title="About the role" html={job.description} />
                        <Prose title="Responsibilities" html={job.responsibilities} />
                        <Prose title="Requirements" html={job.requirements} />
                        <Prose title="Educational qualifications" html={job.education} />
                        <Prose title="Benefits" html={job.benefits} />

                        {job.skills?.length > 0 && (
                            <div className="mt-8">
                                <h2 className="display text-[1.05rem] font-bold uppercase tracking-[0.04em] text-ink">
                                    Skills
                                </h2>
                                <ul className="mt-3 flex flex-wrap gap-2">
                                    {job.skills.map((s: string) => (
                                        <li
                                            key={s}
                                            className="rounded-full bg-cream px-3 py-1.5 text-[12.5px] text-ink/70"
                                        >
                                            {s}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* ── Apply ──────────────────────────────────────── */}
                        <div id="apply" className="mt-12 scroll-mt-[130px]">
                            <h2 className="display section-heading uppercase text-ink">
                                Apply for this position
                            </h2>
                            <p className="body-copy mt-2 max-w-2xl text-[14px] leading-[1.7] text-ink/55">
                                No account needed. Fill in your details, attach your CV and submit —
                                our HR team will contact you directly if you are shortlisted.
                            </p>

                            <div className="mt-6">
                                {closed ? (
                                    <div className="rounded-lg border border-ink/12 bg-cream/40 p-8 text-center">
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
                        <div className="rounded-lg border border-ink/10 bg-cream/30 p-5">
                            <h2 className="display text-[0.95rem] font-bold uppercase tracking-[0.06em] text-ink">
                                Job summary
                            </h2>
                            <div className="mt-4 space-y-4">
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
                                    className="mt-6 flex h-12 w-full items-center justify-center rounded-md bg-brand text-[12px] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-brand-dark"
                                >
                                    Apply now
                                </a>
                            )}

                            {job.jdFile ? (
                                <a
                                    href={job.jdFile}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-2.5 flex h-12 w-full items-center justify-center gap-2 rounded-md border border-ink/15 text-[12px] font-bold uppercase tracking-[0.12em] text-ink transition-colors hover:border-brand hover:text-brand"
                                >
                                    <FiDownload /> Job description
                                </a>
                            ) : null}

                            {(job.contactEmail || job.contactPhone) && (
                                <div className="mt-6 border-t border-ink/10 pt-4">
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
