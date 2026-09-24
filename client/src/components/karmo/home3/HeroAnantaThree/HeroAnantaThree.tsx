"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowRight, FiMapPin, FiChevronRight, FiChevronLeft } from "react-icons/fi";

const heroSlides = [
  {
    id: "overview",
    tag: "KARMO GROUP SINCE 1965",
    title: "fashionably sustaining apparel & foam industry innovation",
    subtitle: "designing, developing and manufacturing private-label apparel and home products for Bangladesh's leading retailers.",
    badge: "Bangladesh's No. 1 Brand",
    mainImage: "/karmo/images/home-02/hero/karmo-family-white-outfits.webp",
    href: "/products",
    linkText: "Explore Group Range",
  },
  {
    id: "foam",
    tag: "01 / FOAM DIVISION",
    title: "redefining everyday comfort and acoustic luxury",
    subtitle: "furniture, upholstery, footwear, automotive and acoustic polyurethane grades — poured, cured and cut in Karmo's own plants.",
    badge: "Karmo 2001 Foam",
    mainImage: "/karmo/images/mattress/plant-bedroom.jpg",
    href: "/foam",
    linkText: "Discover Foam Craft",
  },
  {
    id: "hometex",
    tag: "02 / HOMETEX DIVISION",
    title: "where comfort meets elegance & finest home linens",
    subtitle: "bed sheets, comforters, pillows and luxury quilts — the soft layers that bring beauty and relaxation into every bedroom.",
    badge: "100% Cotton Sateen",
    mainImage: "/karmo/images/home-02/collections/01-best-selling-karmo-2001-campaign.jpg",
    href: "/hometex",
    linkText: "Explore HomeTex",
  },
  {
    id: "mattress",
    tag: "03 / MATTRESS DIVISION",
    title: "sleep well live well with orthopaedic precision",
    subtitle: "pocket spring, euro top, orthopaedic and memory foam mattresses built on virgin foam made in-house for complete sleep support.",
    badge: "Ergonomic Spine Support",
    mainImage: "/karmo/images/mattress/cloud-poster.jpg",
    href: "/mattress",
    linkText: "Shop Mattresses",
  },
  {
    id: "chemicals",
    tag: "04 / CHEMICALS DIVISION",
    title: "we create the chemistry of industrial comfort",
    subtitle: "adhesives, specialty polyurethane polymers and sodium silicate — the precision chemical foundation behind modern manufacturing.",
    badge: "ISO-Certified Chemistry",
    mainImage: "/karmo/images/mattress/suite-interior.jpg",
    href: "/chemicals",
    linkText: "Explore Chemicals",
  },
  {
    id: "shoppable",
    tag: "05 / LIVING ROOM SCENE",
    title: "curated living spaces designed for modern life",
    subtitle: "step inside complete interior scenes with Karmo modular foam seating, accent pillows, and handcrafted home furnishings.",
    badge: "Shoppable Interiors",
    mainImage: "/karmo/images/mattress/plant-bedroom.jpg",
    href: "/shop",
    linkText: "Shop The Look",
  },
];

export default function HeroAnantaThree() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % heroSlides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 7000);
    return () => clearInterval(interval);
  }, [nextSlide, isPaused]);

  const handleTouchStart = (e: React.TouchEvent<HTMLElement>) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLElement>) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50) nextSlide();
    if (distance < -50) prevSlide();
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  const activeSlide = heroSlides[activeIndex];

  return (
    <section
      className="relative min-h-[100svh] w-full overflow-hidden bg-black text-white selection:bg-brand selection:text-white flex flex-col justify-between"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSlide.id}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
        >
          <Image
            src={activeSlide.mainImage}
            alt={activeSlide.tag}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/25 sm:bg-black/20" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 w-full max-w-[1800px] mx-auto px-6 lg:px-12 h-full flex-1 flex flex-col justify-between pt-24 pb-8 sm:pt-28 sm:pb-12 lg:pt-32 lg:pb-14">
        <div className="flex items-center justify-between border-b border-white/20 pb-3 sm:pb-4 [text-shadow:_0_1px_8px_rgba(0,0,0,0.9)]">
          <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.25em] font-semibold text-white uppercase">
            <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-brand animate-pulse" />
            Karmo Group
            <span className="text-white/50">•</span>
            <span className="inline-block text-white/90">{activeSlide.badge}</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 text-[11px] sm:text-xs font-mono text-white">
            <span>
              <strong className="text-brand font-bold">{String(activeIndex + 1).padStart(2, "0")}</strong> /{" "}
              {String(heroSlides.length).padStart(2, "0")}
            </span>
          </div>
        </div>

        <div className="my-auto max-w-3xl pt-4 pb-4 pr-12 sm:pr-20 md:pr-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              <span className="inline-block px-2.5 py-1 sm:px-3.5 sm:py-1.5 bg-brand text-white text-[9.5px] sm:text-[11px] font-bold tracking-[0.18em] uppercase rounded mb-3 sm:mb-4 shadow-lg">
                {activeSlide.tag}
              </span>

              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12] sm:leading-[1.08] capitalize [text-shadow:_0_2px_14px_rgba(0,0,0,0.95)]">
                {activeSlide.title}
              </h1>

              <p className="mt-3 sm:mt-5 text-xs sm:text-base lg:text-lg text-white/95 max-w-2xl font-normal leading-relaxed [text-shadow:_0_1px_10px_rgba(0,0,0,0.9)] line-clamp-3 sm:line-clamp-none">
                {activeSlide.subtitle}
              </p>

              <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
                <Link
                  href={activeSlide.href}
                  className="group inline-flex items-center justify-center gap-2.5 bg-brand hover:bg-brand-dark text-white px-6 py-3 sm:px-8 sm:py-4 text-[11px] sm:text-xs font-bold uppercase tracking-[0.14em] transition-all duration-300 shadow-lg hover:shadow-brand/30 rounded sm:rounded-none"
                >
                  {activeSlide.linkText}
                  <FiArrowRight className="text-sm sm:text-base transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/find-store"
                  className="inline-flex items-center justify-center gap-2 border border-white/50 hover:border-white hover:bg-white hover:text-black text-white px-5 py-3 sm:px-7 sm:py-4 text-[11px] sm:text-xs font-bold uppercase tracking-[0.14em] transition-all duration-300 rounded sm:rounded-none"
                >
                  <FiMapPin className="text-sm sm:text-base" />
                  Find a Store
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between border-t border-white/20 pt-3 sm:pt-4">
          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              aria-label="Previous slide"
              className="p-2 sm:p-2.5 rounded-full border border-white/25 hover:border-white hover:bg-white/10 transition-colors text-white cursor-pointer"
            >
              <FiChevronLeft className="text-base sm:text-lg" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next slide"
              className="p-2 sm:p-2.5 rounded-full border border-white/25 hover:border-white hover:bg-white/10 transition-colors text-white cursor-pointer"
            >
              <FiChevronRight className="text-base sm:text-lg" />
            </button>
            <span className="text-[11px] sm:text-xs text-white/60 ml-2.5 hidden sm:inline-block">
              Swipe or click thumbnails to switch
            </span>
          </div>
        </div>

        <div className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2 sm:gap-3 py-3 sm:py-4 px-1.5 sm:px-2 bg-black/30 backdrop-blur-md rounded-full border border-white/15 shadow-2xl">
          {heroSlides.map((slide, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={`thumb-${slide.id}`}
                onClick={() => setActiveIndex(idx)}
                title={slide.tag}
                aria-label={`Slide ${idx + 1}: ${slide.tag}`}
                className={`relative group w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full overflow-hidden border-2 transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "border-brand ring-2 ring-brand/60 scale-110 shadow-lg shadow-brand/40"
                    : "border-white/40 hover:border-white hover:scale-105 opacity-80 hover:opacity-100"
                }`}
              >
                <Image
                  src={slide.mainImage}
                  alt={slide.tag}
                  fill
                  className="object-cover"
                  sizes="44px"
                />
                <div
                  className={`absolute inset-0 transition-opacity duration-300 ${
                    isActive ? "bg-brand/20" : "bg-black/30 group-hover:bg-transparent"
                  }`}
                />

                <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 hidden md:group-hover:block whitespace-nowrap bg-black text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow-md border border-white/20 pointer-events-none z-40">
                  {slide.tag}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
