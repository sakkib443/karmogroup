"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  FiCalendar,
  FiLayers,
  FiMapPin,
  FiTruck,
  FiArrowUpRight,
} from "react-icons/fi";

const pillars = [
  { 
    id: "heritage", 
    icon: FiCalendar, 
    title: "60 YEARS STRONG", 
    desc: "Manufacturing in Bangladesh since 1965, six decades of craft in every product." 
  },
  { 
    id: "manufacturing", 
    icon: FiLayers, 
    title: "MARKET LEADER IN FOAM", 
    desc: "Poured, cut and tested in our own plants, leading Bangladesh by volume." 
  },
  { 
    id: "logistics", 
    icon: FiMapPin, 
    title: "STOCKISTS NATIONWIDE", 
    desc: "Reaching homes through dealers and retailers across the country." 
  },
  { 
    id: "delivery", 
    icon: FiTruck, 
    title: "FREE DELIVERY", 
    desc: "Every order ships free, wherever you are in Bangladesh." 
  },
];

export default function KarmoStandardThree() {
  return (
    <section className="w-full bg-white text-gray-900 py-16 lg:py-20 border-y border-gray-100 overflow-hidden font-['Inter',sans-serif]">
      <div className="relative z-10 w-full max-w-[1800px] mx-auto px-6 lg:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col xl:flex-row items-start xl:items-center gap-12 xl:gap-0"
        >
          
          {/* Left Block: Title */}
          <div className="w-full xl:w-[22%] shrink-0 pr-8 xl:border-r border-gray-200">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-[2px] bg-red-600"></div>
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-red-600">
                The Karmo Standard
              </span>
            </div>
            <h2 className="text-[26px] lg:text-[32px] font-medium leading-[1.25] tracking-tight text-gray-900 uppercase">
              Trusted Craft, <br />
              <span className="text-red-600 font-bold">Nationwide</span> <br />
              Reach
            </h2>
          </div>

          {/* Middle Block: Pillars */}
          <div className="w-full xl:w-[68%] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 xl:gap-8 px-0 xl:px-10">
            {pillars.map((p) => (
              <div key={p.id} className="group">
                <div className="w-[60px] h-[60px] rounded-full bg-red-50 flex items-center justify-center text-red-600 mb-6 transition-transform duration-300 group-hover:bg-red-100">
                  <p.icon className="text-[26px] stroke-[1.5]" />
                </div>
                <h3 className="text-[13px] font-bold text-gray-900 uppercase tracking-wide mb-3 leading-snug pr-4">
                  {p.title}
                </h3>
                <p className="text-[13px] text-gray-500 leading-relaxed pr-2">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Right Block: CTA */}
          <div className="w-full xl:w-[10%] shrink-0 flex flex-col items-center xl:items-end justify-center mt-4 xl:mt-0">
            <Link href="/about" className="group flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#e30613] text-white flex items-center justify-center transition-all duration-300 group-hover:bg-red-700 group-hover:shadow-[0_0_20px_rgba(227,6,19,0.3)]">
                <FiArrowUpRight className="text-2xl transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
              <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-gray-800 group-hover:text-red-600 transition-colors">
                Our Story
              </span>
            </Link>
          </div>

        </motion.div>
      </div>
    </section>
  );
}
