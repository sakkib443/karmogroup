"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { LuSave, LuArrowLeft, LuUpload, LuX, LuCheck, LuLoader } from "react-icons/lu";

import {
    useCreateJobMutation,
    useUpdateJobMutation,
    useGetJobQuery,
} from "@/redux/api/jobApi";
import {
    DIVISIONS, EMPLOYMENT_TYPES, WORKPLACE_TYPES, EXPERIENCE_LEVELS, JOB_STATUSES,
} from "@/components/karmo/career/careerConstants";
import { uploadCareerFile, MAX_FILE_BYTES } from "@/components/karmo/career/uploadFile";

import "react-quill-new/dist/quill.snow.css";

/* Quill touches `document` on import, so it cannot be server-rendered. */
const ReactQuill = dynamic(() => import("react-quill-new"), {
    ssr: false,
    loading: () => <div className="h-32 animate-pulse rounded-lg bg-slate-100" />,
});

/**
 * Create / edit a posting.
 *
 * Everything except the title is optional — HR can publish a bare vacancy in
 * seconds and fill the rest in later, and the public page hides whatever is
 * still empty rather than rendering blank headings.
 *
 * The long fields are HTML from Quill. That is only safe because this screen is
 * admin-only; the same `dangerouslySetInnerHTML` on the public side would be a
 * hole if candidates could ever write into these.
 */

const QUILL_MODULES = {
    toolbar: [
        [{ header: [2, 3, false] }],
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link"],
        ["clean"],
    ],
};

const EMPTY = {
    title: "", division: "corporate", department: "", employmentType: "full-time",
    workplaceType: "on-site", location: "", experienceLevel: "any",
    vacancies: 1, experienceMin: "", experienceMax: "",
    salaryMin: "", salaryMax: "", salaryCurrency: "BDT", salaryPeriod: "monthly",
    salaryNegotiable: false,
    summary: "", description: "", responsibilities: "", requirements: "",
    education: "", benefits: "", skills: "",
    bannerImage: "", jdFile: "", jdFileName: "",
    status: "draft", deadline: "", isUrgent: false, isFeatured: false,
    acceptingApplications: true,
    contactEmail: "", contactPhone: "",
    metaTitle: "", metaDescription: "",
};

function Field({ label, children, hint, className = "" }: any) {
    return (
        <label className={`block ${className}`}>
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                {label}
            </span>
            {children}
            {hint ? <span className="mt-1 block text-xs text-slate-400">{hint}</span> : null}
        </label>
    );
}

const input =
    "w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-slate-500";

function Card({ title, children }: any) {
    return (
        <section className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">{title}</h2>
            <div className="mt-4">{children}</div>
        </section>
    );
}

/** Banner image / JD PDF slot. */
function UploadSlot({ label, hint, accept, value, fileName, onDone, onClear }: any) {
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");

    const pick = async (file?: File) => {
        if (!file) return;
        setError("");
        if (file.size > MAX_FILE_BYTES) return setError("File is larger than 20MB.");
        setBusy(true);
        try {
            onDone(await uploadCareerFile(file));
        } catch (e: any) {
            setError(e?.message || "Upload failed");
        } finally {
            setBusy(false);
        }
    };

    return (
        <Field label={label} hint={hint}>
            {value ? (
                <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-3 py-2.5">
                    <LuCheck className="shrink-0 text-green-600" size={16} />
                    <span className="min-w-0 flex-1 truncate text-sm text-green-800">{fileName || "Attached"}</span>
                    <button type="button" onClick={onClear} className="shrink-0 text-green-700 hover:text-red-600">
                        <LuX size={16} />
                    </button>
                </div>
            ) : (
                <div className="relative">
                    <input type="file" accept={accept} disabled={busy} onChange={(e) => pick(e.target.files?.[0])} className="absolute inset-0 cursor-pointer opacity-0" />
                    <div className={`flex items-center gap-2 rounded-lg border border-dashed px-3 py-2.5 text-sm ${busy ? "border-slate-400 text-slate-600" : "border-slate-300 text-slate-500"}`}>
                        {busy ? <LuLoader className="animate-spin" size={15} /> : <LuUpload size={15} />}
                        {busy ? "Uploading…" : "Choose file"}
                    </div>
                </div>
            )}
            {error ? <span className="mt-1 block text-xs text-red-600">{error}</span> : null}
        </Field>
    );
}

export default function JobForm({ jobId }: { jobId?: string }) {
    const router = useRouter();
    const isEdit = !!jobId;

    const { data: existing, isLoading: loadingJob } = useGetJobQuery(jobId, { skip: !isEdit });
    const [create, { isLoading: creating }] = useCreateJobMutation();
    const [update, { isLoading: updating }] = useUpdateJobMutation();

    const [form, setForm] = useState<any>(EMPTY);
    const [error, setError] = useState("");
    const set = (patch: any) => setForm((f: any) => ({ ...f, ...patch }));

    useEffect(() => {
        const job = existing?.data;
        if (!job) return;
        setForm({
            ...EMPTY,
            ...job,
            skills: (job.skills || []).join(", "),
            deadline: job.deadline ? String(job.deadline).slice(0, 10) : "",
            experienceMin: job.experienceMin ?? "",
            experienceMax: job.experienceMax ?? "",
            salaryMin: job.salaryMin ?? "",
            salaryMax: job.salaryMax ?? "",
        });
    }, [existing]);

    const save = async (status?: string) => {
        setError("");
        if (!form.title.trim()) return setError("A job title is required.");

        const num = (v: any) => (v === "" || v === null ? null : Number(v));
        const payload = {
            ...form,
            status: status || form.status,
            skills: String(form.skills || "").split(",").map((s: string) => s.trim()).filter(Boolean),
            vacancies: Number(form.vacancies) || 1,
            experienceMin: num(form.experienceMin),
            experienceMax: num(form.experienceMax),
            salaryMin: num(form.salaryMin),
            salaryMax: num(form.salaryMax),
            deadline: form.deadline || null,
        };

        try {
            if (isEdit) await update({ id: jobId, data: payload }).unwrap();
            else await create(payload).unwrap();
            router.push("/dashboard/admin/jobs");
        } catch (e: any) {
            setError(e?.data?.message || "Could not save this job.");
        }
    };

    if (isEdit && loadingJob) {
        return <div className="p-6 text-slate-400">Loading…</div>;
    }

    const busy = creating || updating;

    return (
        <div className="p-4 sm:p-6">
            <Link href="/dashboard/admin/jobs" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900">
                <LuArrowLeft size={15} /> Back to jobs
            </Link>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
                    {isEdit ? "Edit job" : "Post a job"}
                </h1>
                <div className="flex gap-2">
                    <button type="button" disabled={busy} onClick={() => save("draft")} className="h-10 rounded-lg border border-slate-300 px-4 text-sm font-medium text-slate-700 hover:border-slate-400 disabled:opacity-50">
                        Save as draft
                    </button>
                    <button type="button" disabled={busy} onClick={() => save("published")} className="inline-flex h-10 items-center gap-2 rounded-lg bg-slate-900 px-5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50">
                        <LuSave size={15} /> {busy ? "Saving…" : "Publish"}
                    </button>
                </div>
            </div>

            {error ? (
                <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
            ) : null}

            <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
                <div className="space-y-5">
                    <Card title="Basics">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="Job title *" className="sm:col-span-2">
                                <input className={input} value={form.title} onChange={(e) => set({ title: e.target.value })} placeholder="e.g. Production Manager — Foam" />
                            </Field>
                            <Field label="Department">
                                <input className={input} value={form.department} onChange={(e) => set({ department: e.target.value })} placeholder="Production" />
                            </Field>
                            <Field label="Division">
                                <select className={input} value={form.division} onChange={(e) => set({ division: e.target.value })}>
                                    {DIVISIONS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
                                </select>
                            </Field>
                            <Field label="Employment type">
                                <select className={input} value={form.employmentType} onChange={(e) => set({ employmentType: e.target.value })}>
                                    {EMPLOYMENT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                                </select>
                            </Field>
                            <Field label="Workplace">
                                <select className={input} value={form.workplaceType} onChange={(e) => set({ workplaceType: e.target.value })}>
                                    {WORKPLACE_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                                </select>
                            </Field>
                            <Field label="Location">
                                <input className={input} value={form.location} onChange={(e) => set({ location: e.target.value })} placeholder="Dhaka, Bangladesh" />
                            </Field>
                            <Field label="Vacancies">
                                <input type="number" min={0} className={input} value={form.vacancies} onChange={(e) => set({ vacancies: e.target.value })} />
                            </Field>
                            <Field label="Short summary" hint="One or two lines, shown on the job card" className="sm:col-span-2">
                                <textarea rows={2} className={input} value={form.summary} onChange={(e) => set({ summary: e.target.value })} />
                            </Field>
                        </div>
                    </Card>

                    <Card title="Experience & salary">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="Experience level">
                                <select className={input} value={form.experienceLevel} onChange={(e) => set({ experienceLevel: e.target.value })}>
                                    {EXPERIENCE_LEVELS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
                                </select>
                            </Field>
                            <div className="grid grid-cols-2 gap-3">
                                <Field label="Min years"><input type="number" min={0} className={input} value={form.experienceMin} onChange={(e) => set({ experienceMin: e.target.value })} /></Field>
                                <Field label="Max years"><input type="number" min={0} className={input} value={form.experienceMax} onChange={(e) => set({ experienceMax: e.target.value })} /></Field>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <Field label="Salary from"><input type="number" min={0} className={input} value={form.salaryMin} onChange={(e) => set({ salaryMin: e.target.value })} disabled={form.salaryNegotiable} /></Field>
                                <Field label="Salary to"><input type="number" min={0} className={input} value={form.salaryMax} onChange={(e) => set({ salaryMax: e.target.value })} disabled={form.salaryNegotiable} /></Field>
                            </div>
                            <Field label="Salary period">
                                <select className={input} value={form.salaryPeriod} onChange={(e) => set({ salaryPeriod: e.target.value })} disabled={form.salaryNegotiable}>
                                    <option value="monthly">Monthly</option>
                                    <option value="yearly">Yearly</option>
                                    <option value="hourly">Hourly</option>
                                </select>
                            </Field>
                            <label className="flex items-center gap-2.5 sm:col-span-2">
                                <input type="checkbox" checked={form.salaryNegotiable} onChange={(e) => set({ salaryNegotiable: e.target.checked })} className="h-4 w-4 rounded" />
                                <span className="text-sm text-slate-700">Salary negotiable — show &quot;Negotiable&quot; instead of a range</span>
                            </label>
                            <Field label="Skills" hint="Separate with commas" className="sm:col-span-2">
                                <input className={input} value={form.skills} onChange={(e) => set({ skills: e.target.value })} placeholder="Production planning, QC, Excel" />
                            </Field>
                        </div>
                    </Card>

                    <Card title="Job description">
                        <div className="space-y-5">
                            {[
                                { key: "description", label: "About the role" },
                                { key: "responsibilities", label: "Responsibilities" },
                                { key: "requirements", label: "Requirements" },
                                { key: "education", label: "Educational qualifications" },
                                { key: "benefits", label: "Benefits" },
                            ].map((f) => (
                                <Field key={f.key} label={f.label}>
                                    <ReactQuill
                                        theme="snow"
                                        modules={QUILL_MODULES}
                                        value={form[f.key]}
                                        onChange={(html: string) => set({ [f.key]: html })}
                                    />
                                </Field>
                            ))}
                        </div>
                    </Card>

                    <Card title="SEO">
                        <div className="grid gap-4">
                            <Field label="Meta title"><input className={input} value={form.metaTitle} onChange={(e) => set({ metaTitle: e.target.value })} /></Field>
                            <Field label="Meta description"><textarea rows={2} className={input} value={form.metaDescription} onChange={(e) => set({ metaDescription: e.target.value })} /></Field>
                        </div>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-5">
                    <Card title="Publishing">
                        <div className="space-y-4">
                            <Field label="Status">
                                <select className={input} value={form.status} onChange={(e) => set({ status: e.target.value })}>
                                    {JOB_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                                </select>
                            </Field>
                            <Field label="Application deadline">
                                <input type="date" className={input} value={form.deadline} onChange={(e) => set({ deadline: e.target.value })} />
                            </Field>
                            <label className="flex items-center gap-2.5">
                                <input type="checkbox" checked={form.acceptingApplications} onChange={(e) => set({ acceptingApplications: e.target.checked })} className="h-4 w-4 rounded" />
                                <span className="text-sm text-slate-700">Accepting applications</span>
                            </label>
                            <label className="flex items-center gap-2.5">
                                <input type="checkbox" checked={form.isUrgent} onChange={(e) => set({ isUrgent: e.target.checked })} className="h-4 w-4 rounded" />
                                <span className="text-sm text-slate-700">Urgent hiring</span>
                            </label>
                            <label className="flex items-center gap-2.5">
                                <input type="checkbox" checked={form.isFeatured} onChange={(e) => set({ isFeatured: e.target.checked })} className="h-4 w-4 rounded" />
                                <span className="text-sm text-slate-700">Feature at the top</span>
                            </label>
                        </div>
                    </Card>

                    <Card title="Media">
                        <div className="space-y-4">
                            <UploadSlot
                                label="Banner image"
                                hint="Shown at the top of the posting"
                                accept=".jpg,.jpeg,.png,.webp"
                                value={form.bannerImage}
                                fileName={form.bannerImage ? "Banner attached" : ""}
                                onDone={(f: any) => set({ bannerImage: f.url })}
                                onClear={() => set({ bannerImage: "" })}
                            />
                            <UploadSlot
                                label="Job description (PDF)"
                                hint="Candidates can download this"
                                accept=".pdf,.doc,.docx"
                                value={form.jdFile}
                                fileName={form.jdFileName}
                                onDone={(f: any) => set({ jdFile: f.url, jdFileName: f.fileName })}
                                onClear={() => set({ jdFile: "", jdFileName: "" })}
                            />
                        </div>
                    </Card>

                    <Card title="Contact for questions">
                        <div className="space-y-4">
                            <Field label="Email"><input className={input} value={form.contactEmail} onChange={(e) => set({ contactEmail: e.target.value })} placeholder="hr@karmogroup.com" /></Field>
                            <Field label="Phone"><input className={input} value={form.contactPhone} onChange={(e) => set({ contactPhone: e.target.value })} /></Field>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
