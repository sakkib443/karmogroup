"use client";

import { useState } from "react";
import Link from "next/link";
import { FiSearch, FiLoader, FiArrowLeft } from "react-icons/fi";

import { useLazyTrackApplicationQuery } from "@/redux/api/jobApi";
import { APPLICATION_STATUSES, STATUS_TONE } from "./careerConstants";

/**
 * Status lookup by tracking ID — the only thing a candidate gets instead of an
 * account.
 *
 * The endpoint returns a deliberately narrow record (name, job, status, date):
 * a tracking ID is guessable enough that it must never expose a phone number,
 * a CV link or HR's private notes.
 *
 * Lazy query rather than a normal one so nothing is fetched until the candidate
 * actually presses Track.
 */
export default function TrackApplication() {
    const [id, setId] = useState("");
    const [trigger, { data, isFetching, isError, isUninitialized }] = useLazyTrackApplicationQuery();

    const application: any = data?.data;
    const status = APPLICATION_STATUSES.find((s) => s.value === application?.status);

    const search = (e: React.FormEvent) => {
        e.preventDefault();
        const clean = id.trim();
        if (clean) trigger(clean);
    };

    /* Where the candidate is in the pipeline, so "Interview" reads as progress
       rather than just a word. Rejected is never a step on the line. */
    const pipeline = APPLICATION_STATUSES.filter((s) => s.value !== "rejected");
    const stepIndex = pipeline.findIndex((s) => s.value === application?.status);

    return (
        <section className="bg-white py-14 lg:py-20">
            <div className="shell max-w-2xl">
                <Link
                    href="/career"
                    className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.1em] text-ink/50 transition-colors hover:text-brand"
                >
                    <FiArrowLeft /> All openings
                </Link>

                <h1 className="display section-heading mt-4 uppercase text-ink">
                    Track your application
                </h1>
                <p className="body-copy mt-3 text-[15px] leading-[1.75] text-ink/55">
                    Enter the tracking ID you received when you applied — it looks like
                    <span className="font-semibold text-ink"> KG-2026-0042</span>.
                </p>

                <form onSubmit={search} className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <div className="relative flex-1">
                        <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[17px] text-ink/35" />
                        <input
                            value={id}
                            onChange={(e) => setId(e.target.value.toUpperCase())}
                            placeholder="KG-2026-0042"
                            className="body-copy w-full rounded-md border border-ink/15 bg-white py-3.5 pl-11 pr-4 text-[14px] uppercase tracking-[0.04em] text-ink outline-none transition-colors placeholder:normal-case placeholder:tracking-normal placeholder:text-ink/35 focus:border-brand"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isFetching || !id.trim()}
                        className="inline-flex h-[52px] shrink-0 items-center justify-center gap-2 rounded-md bg-brand px-8 text-[12px] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
                    >
                        {isFetching ? <FiLoader className="animate-spin" /> : null}
                        {isFetching ? "Checking…" : "Track"}
                    </button>
                </form>

                {/* ── Result ─────────────────────────────────────────────── */}
                {!isUninitialized && !isFetching && (isError || !application) ? (
                    <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-6 text-center">
                        <p className="text-[14px] text-amber-800">
                            No application found for that tracking ID. Please check it and try again.
                        </p>
                    </div>
                ) : null}

                {application ? (
                    <div className="mt-8 rounded-lg border border-ink/10 bg-cream/30 p-6 sm:p-7">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                            <div className="min-w-0">
                                <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink/40">
                                    Tracking ID
                                </p>
                                <p className="display mt-1 text-[1.2rem] font-bold tracking-[0.04em] text-brand">
                                    {application.trackingId}
                                </p>
                            </div>
                            {status ? (
                                <span
                                    className={`rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] ring-1 ${STATUS_TONE[status.tone]}`}
                                >
                                    {status.label}
                                </span>
                            ) : null}
                        </div>

                        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                            <div>
                                <dt className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ink/40">
                                    Applicant
                                </dt>
                                <dd className="mt-1 text-[14px] font-medium text-ink">{application.fullName}</dd>
                            </div>
                            <div>
                                <dt className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ink/40">
                                    Position
                                </dt>
                                <dd className="mt-1 text-[14px] font-medium text-ink">{application.jobTitle}</dd>
                            </div>
                            <div>
                                <dt className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ink/40">
                                    Applied on
                                </dt>
                                <dd className="mt-1 text-[14px] font-medium text-ink">
                                    {new Date(application.createdAt).toLocaleDateString("en-GB", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </dd>
                            </div>
                        </dl>

                        {application.status === "rejected" ? (
                            <p className="mt-6 rounded-md border border-ink/10 bg-white px-4 py-3 text-[13.5px] leading-[1.7] text-ink/60">
                                Thank you for your interest. This application was not taken forward, but
                                you are welcome to apply for other openings.
                            </p>
                        ) : (
                            <div className="mt-7">
                                <p className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ink/40">
                                    Progress
                                </p>
                                <ol className="mt-3 flex gap-1.5">
                                    {pipeline.map((s, i) => (
                                        <li key={s.value} className="flex-1">
                                            <span
                                                className={`block h-1.5 rounded-full ${
                                                    i <= stepIndex ? "bg-brand" : "bg-ink/12"
                                                }`}
                                            />
                                            <span
                                                className={`mt-2 block text-[10.5px] font-semibold uppercase tracking-[0.06em] ${
                                                    i <= stepIndex ? "text-ink/70" : "text-ink/30"
                                                }`}
                                            >
                                                {s.label}
                                            </span>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        )}

                        <p className="mt-6 text-[12.5px] leading-[1.7] text-ink/45">
                            Our HR team contacts shortlisted candidates directly by phone or email.
                            There is nothing else you need to do here.
                        </p>
                    </div>
                ) : null}
            </div>
        </section>
    );
}
