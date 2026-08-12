"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiMapPin,
} from "react-icons/fi";

import LeafRule from "@/components/karmo/about/LeafRule";
import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

const inputCls =
  "w-full rounded-none border border-ink/15 bg-white px-4 py-3.5 text-[14px] text-ink outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-ink/35 focus:border-brand/50 focus:shadow-[0_0_0_3px_rgba(212,67,72,0.08)]";

const labelCls =
  "mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.1em] text-ink/55";

export default function ContactFormSection({
  subjects = [],
  hours = [],
  tips = [],
  office = "",
  email = "info@karmogroup.com",
}) {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) {
      next.email = "Valid email required";
    }
    if (!form.message.trim()) next.message = "Message is required";
    return next;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const next = validate();
    if (Object.keys(next).length) {
      setErrors(next);
      return;
    }
    setLoading(true);

    const subject = encodeURIComponent(
      form.subject
        ? `[${form.subject}] Message from ${form.name}`
        : `Message from ${form.name}`
    );
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone || "—"}\nSubject: ${form.subject || "—"}\n\n${form.message}`
    );

    // Same mailto handoff as the homepage contact band — no backend on this page yet.
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    setLoading(false);
    setSent(true);
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    setTimeout(() => setSent(false), 6000);
  };

  return (
    <section className="bg-white py-14 md:py-20 lg:py-24">
      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="shell grid gap-14 lg:grid-cols-12 lg:gap-16"
      >
        {/* ── Form ───────────────────────────────────────────────────────── */}
        <motion.div variants={fade} className="lg:col-span-7">
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">
            Write to us
          </span>
          <h2 className="display mt-3 text-[1.55rem] font-light uppercase leading-[1.15] tracking-[0.01em] text-ink lg:text-[1.85rem]">
            Send a{" "}
            <span className="font-bold text-brand">message</span>
          </h2>
          <LeafRule align="start" />
          <p className="body-copy mt-5 max-w-lg text-[14px] leading-relaxed text-ink/55">
            Tell us what you need — product advice, an order, dealership or
            industrial supply. We reply within one working day.
          </p>

          {sent ? (
            <div className="mt-8 flex items-start gap-3 border border-brand/20 bg-brand/[0.05] px-4 py-3.5">
              <FiCheckCircle className="mt-0.5 shrink-0 text-brand" size={18} />
              <div>
                <p className="text-[13px] font-semibold text-ink">
                  Opening your mail app…
                </p>
                <p className="mt-0.5 text-[12px] text-ink/55">
                  Send the draft and our team will get back to you.
                </p>
              </div>
            </div>
          ) : null}

          <form onSubmit={onSubmit} noValidate className="mt-8 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls}>
                  Full name <span className="text-brand">*</span>
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  placeholder="Your full name"
                  className={`${inputCls} ${errors.name ? "border-brand" : ""}`}
                />
                {errors.name ? (
                  <p className="mt-1 text-[11px] text-brand">{errors.name}</p>
                ) : null}
              </div>
              <div>
                <label className={labelCls}>Phone</label>
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={onChange}
                  placeholder="01XXXXXXXXX"
                  className={inputCls}
                />
              </div>
            </div>

            <div>
              <label className={labelCls}>
                Email <span className="text-brand">*</span>
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                placeholder="name@example.com"
                className={`${inputCls} ${errors.email ? "border-brand" : ""}`}
              />
              {errors.email ? (
                <p className="mt-1 text-[11px] text-brand">{errors.email}</p>
              ) : null}
            </div>

            <div>
              <label className={labelCls}>Subject</label>
              <select
                name="subject"
                value={form.subject}
                onChange={onChange}
                className={`${inputCls} cursor-pointer appearance-auto`}
              >
                <option value="">Select a topic…</option>
                {subjects.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelCls}>
                Message <span className="text-brand">*</span>
              </label>
              <textarea
                name="message"
                rows={5}
                value={form.message}
                onChange={onChange}
                placeholder="How can we help?"
                className={`${inputCls} min-h-[140px] resize-y ${
                  errors.message ? "border-brand" : ""
                }`}
              />
              {errors.message ? (
                <p className="mt-1 text-[11px] text-brand">{errors.message}</p>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2.5 bg-ink px-8 py-3.5 text-[12px] font-bold uppercase tracking-[0.16em] text-white transition-colors duration-300 hover:bg-brand disabled:cursor-not-allowed disabled:bg-ink/25"
            >
              {loading ? "Sending…" : "Send message"}
              <FiArrowRight className="text-[15px]" />
            </button>
          </form>
        </motion.div>

        {/* ── Side info ──────────────────────────────────────────────────── */}
        <motion.aside variants={fade} className="lg:col-span-5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">
            Visit & hours
          </span>
          <h2 className="display mt-3 text-[1.45rem] font-light uppercase leading-[1.15] tracking-[0.01em] text-ink lg:text-[1.65rem]">
            Head{" "}
            <span className="font-bold text-brand">office</span>
          </h2>
          <LeafRule align="start" />

          {office ? (
            <div className="mt-8 flex items-start gap-4 border border-ink/10 px-5 py-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-brand/25 text-brand">
                <FiMapPin className="text-[18px]" />
              </span>
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-brand">
                  Motijheel, Dhaka
                </span>
                <p className="mt-2 text-[14px] leading-relaxed text-ink/70">
                  {office}
                </p>
                <Link
                  href={`https://maps.google.com/?q=${encodeURIComponent(office)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-brand hover:underline"
                >
                  Open in maps
                  <FiArrowRight className="text-[13px]" />
                </Link>
              </div>
            </div>
          ) : null}

          {hours.length > 0 ? (
            <div className="mt-4 border border-ink/10">
              <div className="flex items-center gap-2.5 border-b border-ink/8 bg-cream/60 px-5 py-3.5">
                <FiClock className="text-brand" size={15} />
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink">
                  Business hours
                </span>
              </div>
              <ul>
                {hours.map((h, i) => (
                  <li
                    key={`${h.day}-${i}`}
                    className={`flex items-center justify-between gap-4 px-5 py-3.5 ${
                      i < hours.length - 1 ? "border-b border-ink/8" : ""
                    }`}
                  >
                    <span className="text-[13px] font-medium text-ink/70">
                      {h.day}
                    </span>
                    <span
                      className={`text-[12px] font-bold uppercase tracking-[0.08em] ${
                        String(h.time).toLowerCase() === "closed"
                          ? "text-ink/35"
                          : "text-brand"
                      }`}
                    >
                      {h.time}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {tips.length > 0 ? (
            <div className="mt-4 border border-ink/10 bg-cream/40 px-5 py-5">
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand">
                Before you write
              </span>
              <ul className="mt-4 space-y-3">
                {tips.map((tip) => (
                  <li
                    key={tip.slice(0, 28)}
                    className="flex gap-3 text-[13px] leading-relaxed text-ink/60"
                  >
                    <span
                      aria-hidden
                      className="mt-2 h-1 w-1 shrink-0 bg-brand"
                    />
                    {tip}
                  </li>
                ))}
              </ul>
              <Link
                href="/find-store"
                className="mt-5 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-ink hover:text-brand"
              >
                Find a store
                <FiArrowRight className="text-[13px]" />
              </Link>
            </div>
          ) : null}
        </motion.aside>
      </motion.div>
    </section>
  );
}
