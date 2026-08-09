"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fade, group, VIEWPORT } from "@/components/karmo/motion";
import HeadingThree, { Mark } from "../HeadingThree/HeadingThree";
import { FiPlus, FiMinus } from "react-icons/fi";

const faqs = [
  {
    question: "What is your 100-night sleep trial?",
    answer:
      "We believe you need more than a few minutes in a showroom to know if a mattress is right for you. Sleep on your Karmo mattress for 100 nights. If you're not completely satisfied, we'll pick it up and give you a full refund.",
  },
  {
    question: "What materials do you use in Karmo mattresses?",
    answer:
      "Our mattresses are crafted using high-resilience foam, pocketed spring arrays, and our proprietary CertiGuard germ protection layers. All materials are ethically sourced and designed for maximum airflow and support.",
  },
  {
    question: "Do Karmo mattresses come with a warranty?",
    answer:
      "Yes. Every Karmo mattress comes with an industry-leading 10-year limited warranty that covers manufacturing defects, including sagging or indentations greater than 1 inch.",
  },
  {
    question: "How is the mattress delivered?",
    answer:
      "Your mattress will be compressed, roll-packed, and shipped in a convenient box directly to your door. Setup takes only a few minutes, and the mattress will fully expand within 24 hours.",
  },
];

export default function FaqThree() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleOpen = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative overflow-hidden bg-white py-24 md:py-32">
      <div className="shell relative z-10 mx-auto max-w-4xl">
        <HeadingThree
          index="07"
          eyebrow="Questions & Answers"
          title={["Everything you", <Mark key="m"> need to know</Mark>]}
          className="mx-auto text-center"
        />

        <motion.div
          variants={group}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="mt-16 border-t border-ink/10"
        >
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={index}
                variants={fade}
                className="border-b border-ink/10"
              >
                <button
                  onClick={() => toggleOpen(index)}
                  className="flex w-full items-center justify-between py-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                  aria-expanded={isOpen}
                >
                  <span className="display text-[17px] font-semibold text-ink sm:text-[19px]">
                    {faq.question}
                  </span>
                  <span className="ml-6 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linen text-ink transition-colors hover:bg-brand hover:text-white">
                    {isOpen ? <FiMinus /> : <FiPlus />}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="pb-8 pr-12">
                        <p className="body-copy text-[15px] leading-relaxed text-ink/70">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
