"use client";

import { motion } from "framer-motion";
import { fade, VIEWPORT } from "@/components/karmo/motion";

export default function NewsletterThree() {
  return (
    <section className="relative overflow-hidden bg-ink py-20">
      <div className="shell relative z-10 mx-auto max-w-4xl text-center">
        <motion.div
          variants={fade}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="flex flex-col items-center"
        >
          <span className="mb-4 block text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">
            Join the Karmo Club
          </span>
          <h2 className="display text-3xl font-light text-white md:text-4xl">
            Sleep tips & exclusive offers.
          </h2>
          <p className="body-copy mt-4 text-[15px] text-white/60">
            Subscribe to our newsletter to receive early access to new collections and sleep wellness advice.
          </p>

          <form 
            onSubmit={(e) => e.preventDefault()}
            className="mt-10 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:gap-0"
          >
            <input
              type="email"
              placeholder="Enter your email address"
              className="h-12 w-full bg-white/10 px-5 text-[15px] text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-brand sm:rounded-none"
              required
            />
            <button
              type="submit"
              className="flex h-12 shrink-0 items-center justify-center bg-brand px-8 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-white hover:text-ink sm:rounded-none"
            >
              Subscribe
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
