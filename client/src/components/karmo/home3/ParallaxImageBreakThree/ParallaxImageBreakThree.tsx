"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

export default function ParallaxImageBreakThree() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Moves the image up/down slightly faster/slower than the scroll for the parallax effect
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <section
      ref={containerRef}
      className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden bg-ink"
    >
      <motion.div
        style={{ y }}
        className="absolute -inset-y-[20%] inset-x-0 h-[140%] w-full"
      >
        <Image
          src="/karmo/images/hero/slide-2-mattress-suite.png"
          alt="Karmo Bedroom Parallax"
          fill
          className="object-cover"
          priority
        />
        {/* Dark subtle overlay for text readability if needed */}
        <div className="absolute inset-0 bg-ink/20 mix-blend-multiply" />
      </motion.div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <h2 className="display text-center text-4xl md:text-6xl lg:text-7xl font-light text-white drop-shadow-lg max-w-4xl px-4">
          Redefining the <span className="font-bold italic">Comfort</span> Standard
        </h2>
      </div>
    </section>
  );
}
