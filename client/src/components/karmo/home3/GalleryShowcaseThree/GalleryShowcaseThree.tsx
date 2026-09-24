"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

const hatilGridItems = [
  {
    id: "01",
    title: "Modular Living Sofa",
    image: "/karmo/images/hatil/hatil-1.png",
    href: "/foam",
    category: "Living Room",
  },
  {
    id: "02",
    title: "Executive Desk Suite",
    image: "/karmo/images/hatil/hatil-2.png",
    href: "/products",
    category: "Office",
  },
  {
    id: "03",
    title: "Ergonomic Red Recliner",
    image: "/karmo/images/hatil/hatil-3.png",
    href: "/foam",
    category: "Relaxation",
  },
  {
    id: "04",
    title: "Modern Dining Set",
    image: "/karmo/images/hatil/hatil-4.png",
    href: "/mattress",
    category: "Dining",
  },
  {
    id: "05",
    title: "Cushioned Yellow Couch",
    image: "/karmo/images/hatil/hatil-5.png",
    href: "/hometex",
    category: "Lounge",
  },
  {
    id: "06",
    title: "Modular Kitchen Cabinet",
    image: "/karmo/images/hatil/hatil-6.png",
    href: "/chemicals",
    category: "Kitchen",
  },
];

function ParallaxCard({
  item,
  className = "",
  index,
}: {
  item: (typeof hatilGridItems)[0];
  className?: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 1.05]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative overflow-hidden rounded-[32px] bg-[#f5f5f7] ${className}`}
    >
      <Link href={item.href} className="absolute inset-0 z-20" />
      
      {/* Image with Parallax */}
      <motion.div className="relative w-full h-full" style={{ y, scale }}>
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110 group-hover:rotate-1"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </motion.div>

      {/* Glassmorphism Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-80" />

      {/* Content Reveal */}
      <div className="absolute inset-0 p-8 flex flex-col justify-end z-10">
        <div className="transform translate-y-4 opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
          <span className="inline-block px-4 py-1.5 mb-3 text-xs font-bold tracking-widest text-white uppercase backdrop-blur-md bg-white/20 rounded-full border border-white/30">
            {item.category}
          </span>
        </div>
        <h3 className="text-2xl md:text-3xl font-medium text-white tracking-tight transform translate-y-2 transition-transform duration-500 ease-out group-hover:translate-y-0">
          {item.title}
        </h3>
        
        {/* Animated Line */}
        <div className="w-0 h-[2px] mt-4 bg-white/70 transition-all duration-700 ease-out group-hover:w-12" />
      </div>

      {/* Decorative Number */}
      <div className="absolute top-6 right-8 text-white/30 font-light text-5xl tracking-tighter mix-blend-overlay transition-transform duration-500 group-hover:-translate-y-2 group-hover:text-white/50">
        {item.id}
      </div>
    </motion.div>
  );
}

export default function GalleryShowcaseThree() {
  return (
    <section className="relative w-full bg-white overflow-hidden py-24 md:py-32 font-['Inter',sans-serif] border-y border-gray-200">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] mix-blend-multiply" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[150px] mix-blend-multiply" />
      </div>

      <div className="relative z-10 max-w-[1800px] mx-auto px-6 lg:px-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-24 gap-8">
          <div className="max-w-2xl">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-gray-500 font-medium tracking-[0.2em] uppercase text-sm mb-4"
            >
              Curated Collections
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-[32px] md:text-[42px] lg:text-[52px] font-medium leading-[1.15] tracking-[-0.02em] uppercase text-gray-900"
            >
              Creations <br className="hidden sm:block" />
              <span className="text-red-600 font-bold">
                with purpose.
              </span>
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link
              href="/products"
              className="group flex items-center gap-3 text-white bg-red-600 hover:bg-red-700 px-8 py-4 rounded-full transition-all duration-300 shadow-md hover:shadow-red-600/30 font-semibold tracking-wide text-sm"
            >
              Explore Collection
              <FiArrowRight className="text-lg transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        {/* Asymmetrical Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 lg:gap-8 auto-rows-[350px] md:auto-rows-[400px] pb-20">
          {/* Card 1 - Large Wide */}
          <ParallaxCard
            item={hatilGridItems[0]}
            index={0}
            className="md:col-span-8 md:row-span-2 min-h-[400px] md:min-h-full"
          />
          
          {/* Card 2 - Standard */}
          <ParallaxCard
            item={hatilGridItems[1]}
            index={1}
            className="md:col-span-4 md:row-span-1"
          />
          
          {/* Card 3 - Standard */}
          <ParallaxCard
            item={hatilGridItems[2]}
            index={2}
            className="md:col-span-4 md:row-span-1"
          />

          {/* Card 4 - Standard */}
          <ParallaxCard
            item={hatilGridItems[3]}
            index={3}
            className="md:col-span-4 md:row-span-1"
          />

          {/* Card 5 - Large Wide */}
          <ParallaxCard
            item={hatilGridItems[4]}
            index={4}
            className="md:col-span-8 md:row-span-1"
          />

          {/* Card 6 - Full Width Accent */}
          <ParallaxCard
            item={hatilGridItems[5]}
            index={5}
            className="md:col-span-12 md:row-span-1 md:h-[500px]"
          />
        </div>
      </div>
    </section>
  );
}

