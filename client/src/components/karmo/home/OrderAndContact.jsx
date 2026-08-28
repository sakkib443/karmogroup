"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FiMail, FiPhone, FiArrowRight } from "react-icons/fi";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * Order guide + contact — content from the client's live site, rebuilt to
 * sit with Home 02 rather than the old hexagon / boxy WordPress layout.
 *
 * Left: four clear steps on one vertical axis (cartoon icons).
 * Right: mail & phone, then a short message form (mailto handoff — no backend
 * on this page yet).
 */

const ORANGE = "#FF9A1F";

const steps = [
  {
    n: "01",
    icon: "/karmo/images/trust/order-cartoon/select.png?v=d44348",
    title: "Select your product",
    body: "Choose the foam, mattress or HomeTex piece that fits the room.",
  },
  {
    n: "02",
    icon: "/karmo/images/trust/order-cartoon/cart.png?v=d44348",
    title: "Add it to the cart",
    body: "Drop your picks in — sizes and quantities stay with you.",
  },
  {
    n: "03",
    icon: "/karmo/images/trust/order-cartoon/checkout.png?v=d44348",
    title: "Complete the checkout",
    body: "Just three details: name, full address, and mobile number.",
  },
  {
    n: "04",
    icon: "/karmo/images/trust/order-cartoon/enjoy.png?v=d44348",
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
      <h2 className="display section-heading mt-3 uppercase text-ink">
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
    <section className="relative overflow-hidden py-16 lg:py-24">
      {/* Same mattress damask as Iconic brands / Divisions */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
        <Image
          src="/karmo/images/mattress/mosaic/karmo-pattern-texture.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center opacity-[0.22]"
          priority={false}
        />
        <span className="absolute inset-0 bg-white/50" />
      </div>

      <div className="shell relative z-[1]">
        <motion.div
          variants={group}
          {...reveal}
          viewport={VIEWPORT}
          className="grid gap-14 lg:grid-cols-2 lg:gap-16 xl:gap-24"
        >
          {/* ── Order steps ─────────────────────────────────────────────── */}
          <motion.div variants={fade} {...reveal} viewport={VIEWPORT}>
            <ColumnHeading
              eyebrow="Simple path"
              title="How to make"
              accent="an order"
            />

            {/* 2×2 aligned rows: 01|03 on top, 02|04 below — shared row height
                keeps the horizontal rules level even when copy lengths differ. */}
            <div className="relative mt-10 grid grid-cols-1 gap-x-8 sm:grid-cols-2 sm:grid-rows-2">
              <span
                aria-hidden
                className="pointer-events-none absolute bottom-8 top-8 left-10 hidden w-px bg-ink/10 sm:block lg:left-[2.75rem]"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute bottom-8 top-8 left-[calc(50%+3.75rem)] hidden w-px bg-ink/10 sm:block"
              />
              {[steps[0], steps[2], steps[1], steps[3]].map((step, index) => (
                <div
                  key={step.n}
                  className={`relative flex items-start gap-4 py-5 lg:gap-5 ${
                    index < 2 ? "border-b border-ink/8" : ""
                  }`}
                >
                  <span className="relative z-[1] flex h-[5rem] w-[5rem] shrink-0 items-center justify-center overflow-visible bg-white lg:h-[5.5rem] lg:w-[5.5rem]">
                    <img
                      src={step.icon}
                      alt=""
                      aria-hidden="true"
                      width={88}
                      height={88}
                      loading="lazy"
                      decoding="async"
                      className={`object-contain ${
                        step.n === "04"
                          ? "h-[5.25rem] w-[5.25rem] lg:h-24 lg:w-24"
                          : step.n === "03"
                            ? "h-[4.35rem] w-[4.35rem] lg:h-[4.85rem] lg:w-[4.85rem]"
                            : "h-[4.65rem] w-[4.65rem] lg:h-[5.15rem] lg:w-[5.15rem]"
                      }`}
                    />
                  </span>
                  <div className="min-w-0 pt-1">
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
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Contact ─────────────────────────────────────────────────── */}
          <motion.div variants={fade} {...reveal} viewport={VIEWPORT}>
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
                  className="w-full border border-ink/12 bg-white px-4 py-3.5 text-[14px] text-ink outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-ink/35 focus:border-brand/50 focus:shadow-[0_0_0_3px_rgba(212,67,72,0.08)]"
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
                  className="w-full border border-ink/12 bg-white px-4 py-3.5 text-[14px] text-ink outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-ink/35 focus:border-brand/50 focus:shadow-[0_0_0_3px_rgba(212,67,72,0.08)]"
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
                  className="w-full resize-y border border-ink/12 bg-white px-4 py-3.5 text-[14px] text-ink outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-ink/35 focus:border-brand/50 focus:shadow-[0_0_0_3px_rgba(212,67,72,0.08)]"
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
