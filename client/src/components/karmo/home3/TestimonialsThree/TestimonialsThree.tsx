/* eslint-disable react/no-unescaped-entities */
"use client";

import { motion } from "framer-motion";
import { fade, group, VIEWPORT } from "@/components/karmo/motion";
import HeadingThree, { Mark } from "../HeadingThree/HeadingThree";
import { FiStar } from "react-icons/fi";

const testimonials = [
  {
    id: 1,
    name: "Sarah Jenkins",
    location: "New York, NY",
    text: "The Karmo mattress has completely transformed how I sleep. It feels like sinking into a cloud, yet it supports my back perfectly throughout the night. Truly exceptional craftsmanship.",
  },
  {
    id: 2,
    name: "David Chen",
    location: "San Francisco, CA",
    text: "I was skeptical at first, but after the first week, I knew this was the best investment for my home. The quality of materials and the attention to detail is evident in every stitch.",
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    location: "Austin, TX",
    text: "From the unboxing experience to the first night of sleep, everything about Karmo screams premium. It perfectly complements our modern aesthetic while delivering unparalleled comfort.",
  },
];

export default function TestimonialsThree() {
  return (
    <section className="relative overflow-hidden bg-linen py-24 md:py-32">
      <div className="relative z-10 max-w-[1800px] mx-auto px-6 lg:px-12">
        <HeadingThree
          index="02"
          eyebrow="Testimonials"
          title={["Sleep", <Mark key="m"> Approved</Mark>]}
          lead="Don't just take our word for it. Hear from those who have already transformed their rest with Karmo."
        />

        <motion.div
          variants={group}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {testimonials.map((t) => (
            <motion.div
              key={t.id}
              variants={fade}
              className="flex flex-col justify-between bg-white/60 p-8 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:shadow-md"
            >
              <div>
                <div className="mb-6 flex text-brand">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className="mr-1 fill-brand text-sm" />
                  ))}
                </div>
                <p className="body-copy text-[15px] leading-relaxed text-ink/80">
                  "{t.text}"
                </p>
              </div>
              
              <div className="mt-8 border-t border-ink/10 pt-6">
                <p className="display text-sm font-semibold tracking-wide text-ink">
                  {t.name}
                </p>
                <p className="mt-1 text-xs text-ink/50 uppercase tracking-widest font-semibold">
                  {t.location}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
