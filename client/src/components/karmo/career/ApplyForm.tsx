"use client";

import { useState } from "react";
import Link from "next/link";
import {
    FiUpload,
    FiCheck,
    FiX,
    FiPlus,
    FiTrash2,
    FiLoader,
    FiArrowLeft,
    FiArrowRight,
} from "react-icons/fi";

import { useApplyForJobMutation } from "@/redux/api/jobApi";
import { uploadCareerFile, prettySize, MAX_FILE_BYTES } from "./uploadFile";

/**
 * The four-step application form.
 *
 * Only name, email, phone and the CV are required — the rest is optional so a
 * candidate can apply from a phone in a minute, or fill in a full profile if
 * they want to. Steps 1 and 4 hold the required fields, so the wizard blocks
 * only on those two; 2 and 3 can be skipped outright.
 *
 * Files upload immediately on selection rather than at submit: a 20MB CV on a
 * Bangladeshi mobile connection can take a while, and doing it inline means the
 * candidate sees the progress against the field instead of watching one long
 * spinner at the end and wondering whether it froze.
 */

type Education = { degree: string; institution: string; field: string; result: string; passingYear: string };
type Experience = { company: string; designation: string; duration: string; responsibilities: string };

const emptyEducation: Education = { degree: "", institution: "", field: "", result: "", passingYear: "" };
const emptyExperience: Experience = { company: "", designation: "", duration: "", responsibilities: "" };

const STEPS = ["Personal", "Professional", "Education", "Files & links"];

function Field({
    label,
    required,
    hint,
    children,
}: {
    label: string;
    required?: boolean;
    hint?: string;
    children: React.ReactNode;
}) {
    return (
        <label className="block">
            <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.1em] text-ink/50">
                {label}
                {required && <span className="ml-1 text-brand">*</span>}
            </span>
            {children}
            {hint ? <span className="mt-1 block text-[11.5px] text-ink/40">{hint}</span> : null}
        </label>
    );
}

const inputClass =
    "w-full rounded-md border border-ink/15 bg-white px-3.5 py-2.5 text-[14px] text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-brand";

/** One upload slot — click to pick, shows the attached file with a remove. */
function FileSlot({
    label,
    hint,
    required,
    value,
    fileName,
    onUploaded,
    onClear,
    accept = ".pdf,.doc,.docx",
}: {
    label: string;
    hint?: string;
    required?: boolean;
    value: string;
    fileName?: string;
    onUploaded: (f: { url: string; fileName: string; size: number }) => void;
    onClear: () => void;
    accept?: string;
}) {
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");

    const pick = async (file?: File) => {
        if (!file) return;
        setError("");
        if (file.size > MAX_FILE_BYTES) {
            setError("File is larger than 20MB.");
            return;
        }
        setBusy(true);
        try {
            onUploaded(await uploadCareerFile(file));
        } catch (e: any) {
            setError(e?.message || "Upload failed.");
        } finally {
            setBusy(false);
        }
    };

    return (
        <Field label={label} required={required} hint={hint}>
            {value ? (
                <div className="flex items-center gap-3 rounded-md border border-green-200 bg-green-50 px-3.5 py-2.5">
                    <FiCheck className="shrink-0 text-green-600" />
                    <span className="min-w-0 flex-1 truncate text-[13px] text-green-800">{fileName || "Attached"}</span>
                    <button
                        type="button"
                        onClick={onClear}
                        aria-label={`Remove ${label}`}
                        className="shrink-0 text-green-700 transition-colors hover:text-red-600"
                    >
                        <FiX />
                    </button>
                </div>
            ) : (
                <div className="relative">
                    <input
                        type="file"
                        accept={accept}
                        disabled={busy}
                        onChange={(e) => pick(e.target.files?.[0])}
                        className="absolute inset-0 cursor-pointer opacity-0 disabled:cursor-wait"
                    />
                    <div
                        className={`flex items-center gap-2.5 rounded-md border border-dashed px-3.5 py-2.5 text-[13px] transition-colors ${
                            busy ? "border-brand/40 text-brand" : "border-ink/20 text-ink/50"
                        }`}
                    >
                        {busy ? <FiLoader className="animate-spin" /> : <FiUpload />}
                        {busy ? "Uploading…" : "Choose file"}
                    </div>
                </div>
            )}
            {error ? <span className="mt-1 block text-[12px] text-red-600">{error}</span> : null}
        </Field>
    );
}

export default function ApplyForm({ job }: { job: any }) {
    const [step, setStep] = useState(0);
    const [done, setDone] = useState<{ trackingId: string } | null>(null);
    const [error, setError] = useState("");

    const [form, setForm] = useState<any>({
        fullName: "", email: "", phone: "", dateOfBirth: "", gender: "",
        nationalId: "", presentAddress: "", permanentAddress: "", district: "",
        currentDesignation: "", currentCompany: "", totalExperience: "",
        currentSalary: "", expectedSalary: "", noticePeriod: "", availableFrom: "",
        skills: "", coverLetterText: "", linkedinUrl: "", portfolioUrl: "", references: "",
        cvUrl: "", cvFileName: "", photoUrl: "", coverLetterUrl: "", portfolioFileUrl: "",
        certificates: [] as string[],
    });
    const [educations, setEducations] = useState<Education[]>([{ ...emptyEducation }]);
    const [experiences, setExperiences] = useState<Experience[]>([{ ...emptyExperience }]);

    const [apply, { isLoading }] = useApplyForJobMutation();
    const set = (patch: any) => setForm((f: any) => ({ ...f, ...patch }));

    const step1Valid = form.fullName.trim() && form.email.trim() && form.phone.trim();
    const canSubmit = step1Valid && form.cvUrl;

    const submit = async () => {
        setError("");
        if (!canSubmit) {
            setError("Please fill your name, email, phone and attach a CV.");
            return;
        }

        /* Empty rows are the default state of the repeaters, not real entries —
           strip them so a candidate who skipped the section does not save a row
           of blanks that the admin then has to read past. */
        const payload = {
            ...form,
            job: job._id,
            skills: String(form.skills || "").split(",").map((s: string) => s.trim()).filter(Boolean),
            totalExperience: form.totalExperience === "" ? null : Number(form.totalExperience),
            currentSalary: form.currentSalary === "" ? null : Number(form.currentSalary),
            expectedSalary: form.expectedSalary === "" ? null : Number(form.expectedSalary),
            dateOfBirth: form.dateOfBirth || null,
            availableFrom: form.availableFrom || null,
            educations: educations.filter((e) => e.degree || e.institution),
            experiences: experiences.filter((e) => e.company || e.designation),
        };

        try {
            const res: any = await apply(payload).unwrap();
            setDone({ trackingId: res?.data?.trackingId });
        } catch (e: any) {
            setError(e?.data?.message || "Could not submit your application. Please try again.");
        }
    };

    // ── Success ────────────────────────────────────────────────────────────
    if (done) {
        return (
            <div className="rounded-lg border border-green-200 bg-green-50 p-8 text-center sm:p-10">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-white">
                    <FiCheck className="text-2xl" />
                </span>
                <h3 className="display mt-5 text-[1.3rem] font-bold uppercase text-ink">
                    Application received
                </h3>
                <p className="body-copy mx-auto mt-2 max-w-md text-[14px] leading-[1.7] text-ink/60">
                    Thank you for applying for <strong>{job.title}</strong>. Our HR team reviews every
                    application and will contact you directly by phone or email if you are shortlisted.
                </p>
                <div className="mx-auto mt-6 inline-block rounded-md border border-green-300 bg-white px-6 py-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/45">
                        Your tracking ID
                    </p>
                    <p className="display mt-1 text-[1.4rem] font-bold tracking-[0.04em] text-brand">
                        {done.trackingId}
                    </p>
                </div>
                <p className="mt-3 text-[12.5px] text-ink/50">
                    Save this ID — you can check your status any time.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <Link
                        href="/career/track"
                        className="inline-flex h-11 items-center rounded-md bg-brand px-6 text-[12px] font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-brand-dark"
                    >
                        Track application
                    </Link>
                    <Link
                        href="/career"
                        className="inline-flex h-11 items-center rounded-md border border-ink/15 px-6 text-[12px] font-bold uppercase tracking-[0.12em] text-ink transition-colors hover:border-brand hover:text-brand"
                    >
                        Other openings
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-lg border border-ink/10 bg-white p-5 sm:p-7">
            {/* ── Step rail ──────────────────────────────────────────────── */}
            <ol className="mb-7 flex flex-wrap gap-2">
                {STEPS.map((name, i) => (
                    <li key={name} className="flex-1 min-w-[120px]">
                        <button
                            type="button"
                            onClick={() => setStep(i)}
                            className={`w-full border-t-2 pt-2.5 text-left transition-colors ${
                                i === step
                                    ? "border-brand text-ink"
                                    : i < step
                                      ? "border-green-500 text-ink/60"
                                      : "border-ink/12 text-ink/35"
                            }`}
                        >
                            <span className="block text-[10px] font-bold uppercase tracking-[0.14em]">
                                Step {i + 1}
                            </span>
                            <span className="mt-0.5 block text-[12.5px] font-semibold">{name}</span>
                        </button>
                    </li>
                ))}
            </ol>

            {/* ── Step 1 · Personal ──────────────────────────────────────── */}
            {step === 0 && (
                <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Full name" required>
                        <input className={inputClass} value={form.fullName} onChange={(e) => set({ fullName: e.target.value })} placeholder="Your full name" />
                    </Field>
                    <Field label="Email" required>
                        <input type="email" className={inputClass} value={form.email} onChange={(e) => set({ email: e.target.value })} placeholder="you@example.com" />
                    </Field>
                    <Field label="Phone" required>
                        <input className={inputClass} value={form.phone} onChange={(e) => set({ phone: e.target.value })} placeholder="01XXXXXXXXX" />
                    </Field>
                    <Field label="Date of birth">
                        <input type="date" className={inputClass} value={form.dateOfBirth} onChange={(e) => set({ dateOfBirth: e.target.value })} />
                    </Field>
                    <Field label="Gender">
                        <select className={inputClass} value={form.gender} onChange={(e) => set({ gender: e.target.value })}>
                            <option value="">Prefer not to say</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </Field>
                    <Field label="District">
                        <input className={inputClass} value={form.district} onChange={(e) => set({ district: e.target.value })} placeholder="Dhaka" />
                    </Field>
                    <Field label="National ID">
                        <input className={inputClass} value={form.nationalId} onChange={(e) => set({ nationalId: e.target.value })} />
                    </Field>
                    <div className="sm:col-span-2">
                        <Field label="Present address">
                            <textarea rows={2} className={inputClass} value={form.presentAddress} onChange={(e) => set({ presentAddress: e.target.value })} />
                        </Field>
                    </div>
                    <div className="sm:col-span-2">
                        <Field label="Permanent address">
                            <textarea rows={2} className={inputClass} value={form.permanentAddress} onChange={(e) => set({ permanentAddress: e.target.value })} />
                        </Field>
                    </div>
                </div>
            )}

            {/* ── Step 2 · Professional ──────────────────────────────────── */}
            {step === 1 && (
                <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Current designation">
                        <input className={inputClass} value={form.currentDesignation} onChange={(e) => set({ currentDesignation: e.target.value })} />
                    </Field>
                    <Field label="Current company">
                        <input className={inputClass} value={form.currentCompany} onChange={(e) => set({ currentCompany: e.target.value })} />
                    </Field>
                    <Field label="Total experience (years)">
                        <input type="number" min={0} step="0.5" className={inputClass} value={form.totalExperience} onChange={(e) => set({ totalExperience: e.target.value })} />
                    </Field>
                    <Field label="Notice period">
                        <input className={inputClass} value={form.noticePeriod} onChange={(e) => set({ noticePeriod: e.target.value })} placeholder="1 month" />
                    </Field>
                    <Field label="Current salary (৳ / month)">
                        <input type="number" min={0} className={inputClass} value={form.currentSalary} onChange={(e) => set({ currentSalary: e.target.value })} />
                    </Field>
                    <Field label="Expected salary (৳ / month)">
                        <input type="number" min={0} className={inputClass} value={form.expectedSalary} onChange={(e) => set({ expectedSalary: e.target.value })} />
                    </Field>
                    <Field label="Available from">
                        <input type="date" className={inputClass} value={form.availableFrom} onChange={(e) => set({ availableFrom: e.target.value })} />
                    </Field>
                    <Field label="Skills" hint="Separate with commas">
                        <input className={inputClass} value={form.skills} onChange={(e) => set({ skills: e.target.value })} placeholder="Production planning, QC, Excel" />
                    </Field>

                    <div className="sm:col-span-2">
                        <div className="mb-2 flex items-center justify-between">
                            <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink/50">
                                Work history
                            </span>
                            <button type="button" onClick={() => setExperiences((x) => [...x, { ...emptyExperience }])} className="inline-flex items-center gap-1 text-[12px] font-semibold text-brand hover:underline">
                                <FiPlus /> Add
                            </button>
                        </div>
                        {experiences.map((exp, i) => (
                            <div key={i} className="mb-3 grid gap-3 rounded-md border border-ink/10 bg-cream/30 p-3 sm:grid-cols-2">
                                <input className={inputClass} placeholder="Company" value={exp.company} onChange={(e) => setExperiences((x) => x.map((v, j) => (j === i ? { ...v, company: e.target.value } : v)))} />
                                <input className={inputClass} placeholder="Designation" value={exp.designation} onChange={(e) => setExperiences((x) => x.map((v, j) => (j === i ? { ...v, designation: e.target.value } : v)))} />
                                <input className={inputClass} placeholder="Duration (e.g. 2021 – 2024)" value={exp.duration} onChange={(e) => setExperiences((x) => x.map((v, j) => (j === i ? { ...v, duration: e.target.value } : v)))} />
                                <div className="flex gap-2">
                                    <input className={inputClass} placeholder="Key responsibilities" value={exp.responsibilities} onChange={(e) => setExperiences((x) => x.map((v, j) => (j === i ? { ...v, responsibilities: e.target.value } : v)))} />
                                    {experiences.length > 1 && (
                                        <button type="button" onClick={() => setExperiences((x) => x.filter((_, j) => j !== i))} aria-label="Remove" className="shrink-0 px-2 text-ink/40 hover:text-red-600">
                                            <FiTrash2 />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Step 3 · Education ─────────────────────────────────────── */}
            {step === 2 && (
                <div>
                    <div className="mb-2 flex items-center justify-between">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink/50">
                            Academic records
                        </span>
                        <button type="button" onClick={() => setEducations((x) => [...x, { ...emptyEducation }])} className="inline-flex items-center gap-1 text-[12px] font-semibold text-brand hover:underline">
                            <FiPlus /> Add another
                        </button>
                    </div>
                    {educations.map((ed, i) => (
                        <div key={i} className="mb-3 grid gap-3 rounded-md border border-ink/10 bg-cream/30 p-3 sm:grid-cols-2">
                            <input className={inputClass} placeholder="Degree (e.g. BSc)" value={ed.degree} onChange={(e) => setEducations((x) => x.map((v, j) => (j === i ? { ...v, degree: e.target.value } : v)))} />
                            <input className={inputClass} placeholder="Institution" value={ed.institution} onChange={(e) => setEducations((x) => x.map((v, j) => (j === i ? { ...v, institution: e.target.value } : v)))} />
                            <input className={inputClass} placeholder="Subject / field" value={ed.field} onChange={(e) => setEducations((x) => x.map((v, j) => (j === i ? { ...v, field: e.target.value } : v)))} />
                            <input className={inputClass} placeholder="Passing year" value={ed.passingYear} onChange={(e) => setEducations((x) => x.map((v, j) => (j === i ? { ...v, passingYear: e.target.value } : v)))} />
                            <div className="flex gap-2 sm:col-span-2">
                                <input className={inputClass} placeholder="Result / CGPA" value={ed.result} onChange={(e) => setEducations((x) => x.map((v, j) => (j === i ? { ...v, result: e.target.value } : v)))} />
                                {educations.length > 1 && (
                                    <button type="button" onClick={() => setEducations((x) => x.filter((_, j) => j !== i))} aria-label="Remove" className="shrink-0 px-2 text-ink/40 hover:text-red-600">
                                        <FiTrash2 />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Step 4 · Files and links ───────────────────────────────── */}
            {step === 3 && (
                <div className="grid gap-4 sm:grid-cols-2">
                    <FileSlot
                        label="CV / Resume"
                        required
                        hint="PDF or DOC, up to 20MB"
                        value={form.cvUrl}
                        fileName={form.cvFileName}
                        onUploaded={(f) => set({ cvUrl: f.url, cvFileName: `${f.fileName} (${prettySize(f.size)})` })}
                        onClear={() => set({ cvUrl: "", cvFileName: "" })}
                    />
                    <FileSlot
                        label="Photograph"
                        hint="JPG or PNG"
                        accept=".jpg,.jpeg,.png,.webp"
                        value={form.photoUrl}
                        onUploaded={(f) => set({ photoUrl: f.url })}
                        onClear={() => set({ photoUrl: "" })}
                    />
                    <FileSlot
                        label="Cover letter (file)"
                        value={form.coverLetterUrl}
                        onUploaded={(f) => set({ coverLetterUrl: f.url })}
                        onClear={() => set({ coverLetterUrl: "" })}
                    />
                    <FileSlot
                        label="Portfolio (PDF)"
                        value={form.portfolioFileUrl}
                        onUploaded={(f) => set({ portfolioFileUrl: f.url })}
                        onClear={() => set({ portfolioFileUrl: "" })}
                    />

                    <Field label="LinkedIn profile">
                        <input className={inputClass} value={form.linkedinUrl} onChange={(e) => set({ linkedinUrl: e.target.value })} placeholder="https://linkedin.com/in/…" />
                    </Field>
                    <Field label="Portfolio / website">
                        <input className={inputClass} value={form.portfolioUrl} onChange={(e) => set({ portfolioUrl: e.target.value })} placeholder="https://…" />
                    </Field>

                    <div className="sm:col-span-2">
                        <Field label="Cover letter" hint="Optional — a short note to the hiring team">
                            <textarea rows={4} className={inputClass} value={form.coverLetterText} onChange={(e) => set({ coverLetterText: e.target.value })} />
                        </Field>
                    </div>
                    <div className="sm:col-span-2">
                        <Field label="References" hint="Name, designation and contact">
                            <textarea rows={2} className={inputClass} value={form.references} onChange={(e) => set({ references: e.target.value })} />
                        </Field>
                    </div>
                </div>
            )}

            {error ? (
                <p className="mt-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
                    {error}
                </p>
            ) : null}

            {/* ── Navigation ─────────────────────────────────────────────── */}
            <div className="mt-7 flex items-center justify-between gap-3 border-t border-ink/10 pt-5">
                <button
                    type="button"
                    disabled={step === 0}
                    onClick={() => setStep((s) => s - 1)}
                    className="inline-flex h-11 items-center gap-2 rounded-md border border-ink/15 px-5 text-[12px] font-bold uppercase tracking-[0.1em] text-ink transition-colors hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <FiArrowLeft /> Back
                </button>

                {step < STEPS.length - 1 ? (
                    <button
                        type="button"
                        onClick={() => {
                            if (step === 0 && !step1Valid) {
                                setError("Name, email and phone are required.");
                                return;
                            }
                            setError("");
                            setStep((s) => s + 1);
                        }}
                        className="inline-flex h-11 items-center gap-2 rounded-md bg-brand px-6 text-[12px] font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-brand-dark"
                    >
                        Continue <FiArrowRight />
                    </button>
                ) : (
                    <button
                        type="button"
                        disabled={isLoading}
                        onClick={submit}
                        className="inline-flex h-11 items-center gap-2 rounded-md bg-brand px-7 text-[12px] font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
                    >
                        {isLoading ? <FiLoader className="animate-spin" /> : <FiCheck />}
                        {isLoading ? "Submitting…" : "Submit application"}
                    </button>
                )}
            </div>

            <p className="mt-4 text-center text-[11.5px] text-ink/40">
                Steps 2 and 3 are optional — you can submit with just your details and CV.
            </p>
        </div>
    );
}
