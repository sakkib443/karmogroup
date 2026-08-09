"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  FiCheck,
  FiShoppingCart,
  FiEdit3,
  FiThumbsUp,
  FiMail,
  FiPhone,
  FiArrowRight,
} from "react-icons/fi";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * Order guide + contact — content from the client's live site, rebuilt to
 * sit with Home 02 rather than the old hexagon / boxy WordPress layout.
 *
 * Left: four clear steps on one vertical axis.
 * Right: mail & phone, then a short message form (mailto handoff — no backend
 * on this page yet).
 */

const ORANGE = "#FF9A1F";

const steps = [
  {
    n: "01",
    icon: FiCheck,
    title: "Select your product",
    body: "Choose the foam, mattress or HomeTex piece that fits the room.",
  },
  {
    n: "02",
    icon: FiShoppingCart,
    title: "Add it to the cart",
    body: "Drop your picks in — sizes and quantities stay with you.",
  },
  {
    n: "03",
    icon: FiEdit3,
    title: "Complete the checkout",
    body: "Just three details: name, full address, and mobile number.",
  },
  {
    n: "04",
    icon: FiThumbsUp,
    title: "Receive & enjoy",
    body: "We deliver. You settle in. Comfort shows up at the door.",
  },
];

function LeafRule({ align = "start" }) {
  return (
    <span
      aria-hidden
      className={`mt-4 flex items-center gap-3 ${
        align === "center" ? "justify-center" : "justify-start"
      }`}
    >
      <span className="h-px w-12 sm:w-16" style={{ backgroundColor: ORANGE }} />
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0">
        <path
          d="M20.5 3.5C20.5 3.5 8.8 2.2 5.4 8.2c-2.6 4.6.6 9.4 4.6 10.3 4.6 1 8.6-2.4 9.6-7.3.6-3.1.9-7.7.9-7.7Z"
          fill={ORANGE}
        />
        <path
          d="M18.6 5.6C14.4 8.4 9.9 12.6 6.7 19.8"
          stroke="#B4651A"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </svg>
      <span className="h-px w-12 sm:w-16" style={{ backgroundColor: ORANGE }} />
    </span>
  );
}

function ColumnHeading({ eyebrow, title, accent }) {
  return (
    <div>
      <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">
        {eyebrow}
      </span>
      <h2 className="display mt-3 text-[1.55rem] font-light uppercase leading-[1.15] tracking-[0.01em] text-ink lg:text-[1.85rem]">
        {title}{" "}
        <span className="font-bold text-brand">{accent}</span>
      </h2>
      <LeafRule />
    </div>
  );
}

export default function OrderAndContact() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  const [name, setName] = useState("");
  const [telephone, setTelephone] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function onSubmit(event) {
    event.preventDefault();
    const subject = encodeURIComponent(`Message from ${name || "website"}`);
    const body = encodeURIComponent(
      `Name: ${name}\nTelephone: ${telephone}\n\n${message}`
    );
    window.location.href = `mailto:info@karmogroup.com?subject=${subject}&body=${body}`;
    setSent(true);
  }

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="shell">
        <motion.div
          variants={group}
          {...reveal}
          viewport={VIEWPORT}
          className="grid gap-14 lg:grid-cols-2 lg:gap-16 xl:gap-24"
        >
          {/* ── Order steps ─────────────────────────────────────────────── */}
          <motion.div variants={fade}>
            <ColumnHeading
              eyebrow="Simple path"
              title="How to make"
              accent="an order"
            />

            {/* Same step treatment, split into two short columns so the
                left side does not run taller than the contact form. */}
            <div className="mt-10 grid gap-x-8 gap-y-2 sm:grid-cols-2">
              {[steps.slice(0, 2), steps.slice(2, 4)].map((column, colIndex) => (
                <ol key={colIndex} className="relative space-y-0">
                  <span
                    aria-hidden
                    className="absolute bottom-6 left-[1.375rem] top-6 w-px bg-ink/10 lg:left-[1.5rem]"
                  />
                  {column.map((step, index) => (
                    <li
                      key={step.n}
                      className={`relative flex gap-4 py-4 lg:gap-5 ${
                        index < column.length - 1 ? "border-b border-ink/8" : ""
                      }`}
                    >
                      <span className="relative z-[1] flex h-11 w-11 shrink-0 items-center justify-center bg-brand text-white shadow-[0_8px_22px_rgba(230,0,0,0.28)]">
                        <step.icon className="text-[18px]" strokeWidth={2.2} />
                      </span>
                      <div className="min-w-0 pt-0.5">
                        <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand/80">
                          Step {step.n}
                        </span>
                        <h3 className="display mt-1.5 text-[1rem] font-bold uppercase tracking-[0.04em] text-ink lg:text-[1.05rem]">
                          {step.title}
                        </h3>
                        <p className="body-copy mt-1.5 text-[13px] leading-relaxed text-ink/55 lg:text-[14px]">
                          {step.body}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              ))}
            </div>
          </motion.div>

          {/* ── Contact ─────────────────────────────────────────────────── */}
          <motion.div variants={fade}>
            <ColumnHeading
              eyebrow="Talk to us"
              title="Have any"
              accent="questions?"
            />

            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              <Link
                href="mailto:info@karmogroup.com"
                className="group flex items-start gap-3.5 border border-ink/10 bg-white px-4 py-4 transition-colors duration-300 hover:border-brand/40"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-brand/25 text-brand transition-colors duration-300 group-hover:bg-brand group-hover:text-white">
                  <FiMail className="text-[18px]" />
                </span>
                <span className="min-w-0 text-left">
                  <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-brand">
                    Mail us
                  </span>
                  <span className="mt-1 block truncate text-[14px] font-semibold text-ink">
                    info@karmogroup.com
                  </span>
                </span>
              </Link>

              <Link
                href="tel:+8801713483284"
                className="group flex items-start gap-3.5 border border-ink/10 bg-white px-4 py-4 transition-colors duration-300 hover:border-brand/40"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-brand/25 text-brand transition-colors duration-300 group-hover:bg-brand group-hover:text-white">
                  <FiPhone className="text-[18px]" />
                </span>
                <span className="min-w-0 text-left">
                  <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-brand">
                    Call us
                  </span>
                  <span className="mt-1 block text-[14px] font-semibold text-ink">
                    01713483284
                  </span>
                </span>
              </Link>
            </div>

            <form onSubmit={onSubmit} className="mt-6 space-y-3">
              <label className="block">
                <span className="sr-only">Name</span>
                <input
                  required
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name *"
                  className="w-full border border-ink/12 bg-white px-4 py-3.5 text-[14px] text-ink outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-ink/35 focus:border-brand/50 focus:shadow-[0_0_0_3px_rgba(230,0,0,0.08)]"
                />
              </label>
              <label className="block">
                <span className="sr-only">Telephone</span>
                <input
                  required
                  name="telephone"
                  type="tel"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  placeholder="Telephone *"
                  className="w-full border border-ink/12 bg-white px-4 py-3.5 text-[14px] text-ink outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-ink/35 focus:border-brand/50 focus:shadow-[0_0_0_3px_rgba(230,0,0,0.08)]"
                />
              </label>
              <label className="block">
                <span className="sr-only">Message</span>
                <textarea
                  required
                  name="message"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Message *"
                  className="w-full resize-y border border-ink/12 bg-white px-4 py-3.5 text-[14px] text-ink outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-ink/35 focus:border-brand/50 focus:shadow-[0_0_0_3px_rgba(230,0,0,0.08)]"
                />
              </label>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2.5 bg-brand px-7 py-3.5 text-[12px] font-bold uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:bg-brand-dark"
                >
                  Send message
                  <FiArrowRight className="text-[15px]" />
                </button>
                {sent ? (
                  <p className="text-[13px] text-ink/55">
                    Opening your mail app…
                  </p>
                ) : null}
              </div>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
