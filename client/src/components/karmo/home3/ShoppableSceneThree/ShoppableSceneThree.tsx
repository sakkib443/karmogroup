"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FiArrowRight, FiPlus } from "react-icons/fi";

const sceneHotspots = [
  {
    id: "sofa",
    title: "Karmo Modular Velvet Sofa",
    price: "৳ 45,000",
    top: "55%",
    left: "40%",
    href: "/products",
  },
  {
    id: "pillow",
    title: "Sateen Accent Cushions",
    price: "৳ 1,800",
    top: "48%",
    left: "58%",
    href: "/hometex",
  },
  {
    id: "foam-core",
    title: "Karmo 2001 High-Resilience Foam",
    price: "৳ 12,500",
    top: "68%",
    left: "30%",
    href: "/foam",
  },
];

export default function ShoppableSceneThree() {
  const [activeSpot, setActiveSpot] = useState<string | null>(null);

  return (
    <section className="w-full bg-[#FAFAFA] text-gray-900 py-24 md:py-32 font-['Inter',sans-serif] overflow-hidden">
      <div className="relative z-10 w-full max-w-[1800px] mx-auto px-4 md:px-8 xl:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* Left Content */}
          <div className="lg:col-span-4 flex flex-col justify-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-4 mb-6"
            >
              <div className="w-12 h-[1px] bg-red-600"></div>
              <span className="text-[10px] md:text-[11px] font-bold tracking-[0.3em] uppercase text-red-600">
                Interactive Scene
              </span>
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-[32px] md:text-[42px] lg:text-[52px] font-medium leading-[1.15] tracking-[-0.02em] uppercase text-gray-900 mb-6"
            >
              Shoppable <br />
              <span className="text-gray-400 font-light">Living Spaces</span>
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-gray-500 text-sm md:text-base font-light leading-relaxed mb-10 max-w-md"
            >
              Explore how Karmo furniture foam, custom upholstery, and HomeTex bedding come together in complete, designer-curated room layouts.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col border-t border-gray-200"
            >
              {sceneHotspots.map((spot) => (
                <Link
                  key={spot.id}
                  href={spot.href}
                  onMouseEnter={() => setActiveSpot(spot.id)}
                  onMouseLeave={() => setActiveSpot(null)}
                  className={`group py-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors duration-500 ${
                    activeSpot === spot.id ? "bg-white -mx-4 px-4 rounded-lg border-transparent shadow-sm" : "bg-transparent"
                  }`}
                >
                  <div>
                    <h4 className="text-[13px] font-bold text-gray-900 uppercase tracking-wide group-hover:text-red-600 transition-colors duration-300">
                      {spot.title}
                    </h4>
                    <span className="block text-xs text-gray-500 font-mono tracking-wider mt-1">
                      {spot.price}
                    </span>
                  </div>
                  <div className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 transform group-hover:translate-x-1 shrink-0 ${
                    activeSpot === spot.id ? "bg-red-600 border-red-600 text-white" : "border-gray-200 text-gray-400"
                  }`}>
                    <FiArrowRight className="text-base" />
                  </div>
                </Link>
              ))}
            </motion.div>
          </div>

          {/* Right Image Scene */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-8 relative aspect-[4/3] md:aspect-[16/10] w-full rounded-sm overflow-hidden bg-gray-100 group shadow-sm hover:shadow-2xl transition-shadow duration-700"
          >
            <Image
              src="/karmo/images/products/karmo-280-scene.png"
              alt="Karmo shoppable living room scene"
              fill
              className="object-cover transition-transform duration-[1.5s] ease-[0.16,1,0.3,1] group-hover:scale-[1.03] filter brightness-[0.98]"
              sizes="(min-width: 1024px) 66vw, 100vw"
            />
            
            {/* Subtle Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-black/5 pointer-events-none" />

            {/* Interactive Hotspots */}
            {sceneHotspots.map((spot) => (
              <div
                key={spot.id}
                style={{ top: spot.top, left: spot.left }}
                className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
                onMouseEnter={() => setActiveSpot(spot.id)}
                onMouseLeave={() => setActiveSpot(null)}
              >
                <div className="relative flex items-center justify-center cursor-pointer">
                  {/* Ripples */}
                  <div className={`absolute w-12 h-12 rounded-full border border-white/60 animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite] ${activeSpot === spot.id ? 'border-red-500/80' : ''}`} />
                  <div className={`absolute w-8 h-8 rounded-full backdrop-blur-sm transition-all duration-300 ${activeSpot === spot.id ? 'scale-150 bg-red-500/20' : 'bg-white/20'}`} />
                  
                  {/* Core Dot */}
                  <div className={`relative w-4 h-4 rounded-full flex items-center justify-center shadow-lg transition-colors duration-300 ${
                    activeSpot === spot.id ? "bg-red-600" : "bg-white"
                  }`}>
                    <FiPlus className={`text-[10px] transition-colors duration-300 ${activeSpot === spot.id ? "text-white rotate-45" : "text-gray-900"}`} />
                  </div>

                  {/* Tooltip */}
                  <AnimatePresence>
                    {activeSpot === spot.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 whitespace-nowrap bg-white text-gray-900 px-4 py-3 rounded-sm shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] pointer-events-none z-30 flex flex-col items-center"
                      >
                        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-900">{spot.title}</span>
                        <span className="text-[10px] font-mono text-gray-500 mt-1">{spot.price}</span>
                        {/* Tooltip Arrow */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-white" />
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              </div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
