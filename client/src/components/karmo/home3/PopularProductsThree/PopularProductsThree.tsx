/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { FiArrowRight, FiShoppingBag } from "react-icons/fi";
import { popularProducts, discountPercent } from "@/components/karmo/home2/popularProducts";
import { useState } from "react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
  },
};

function ProductCardThree({ item }: { item: any }) {
  const onOffer = discountPercent(item.was, item.now) !== null;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      variants={itemVariants}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group flex flex-col"
    >
      <div className="relative w-full aspect-[4/5] bg-[#F6F6F6] rounded-sm overflow-hidden mb-5">
        <Link href={item.href} className="absolute inset-0 z-10" />
        
        <Image
          src={item.image}
          alt={item.alt}
          fill
          className={`object-cover ${item.position} transition-transform duration-[1.5s] ease-[0.16,1,0.3,1] group-hover:scale-105`}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
        />

        {onOffer && (
          <div className="absolute top-4 left-4 z-20">
            <span className="bg-red-600 text-white px-3 py-1 text-[9px] font-bold uppercase tracking-widest">
              Sale
            </span>
          </div>
        )}

        {/* Quick Add Button Overlay */}
        <div className="absolute bottom-4 left-4 right-4 z-20 flex justify-center overflow-hidden">
          <AnimatePresence>
            {isHovered && (
              <motion.button
                initial={{ y: "150%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "150%", opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="w-full bg-red-600 hover:bg-red-700 text-white cursor-pointer py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] transition-colors duration-300 flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
              >
                <FiShoppingBag className="text-sm" />
                Quick Add
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex flex-col items-center text-center px-2">
        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mb-1.5">
          Karmo Exclusive
        </span>
        <h3 className="text-[15px] font-medium text-gray-900 group-hover:text-red-600 transition-colors duration-300 line-clamp-1 mb-2">
          {item.name}
        </h3>
        <div className="flex items-center justify-center gap-3">
          {item.was && (
            <s className="text-[13px] text-gray-400 font-light">{item.was}</s>
          )}
          <span className="text-[14px] font-medium text-gray-900">{item.now}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function PopularProductsThree() {
  return (
    <section className="w-full bg-white text-gray-900 py-24 md:py-32 font-['Inter',sans-serif]">
      <div className="relative z-10 w-full max-w-[1800px] mx-auto px-4 md:px-8 xl:px-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 md:mb-24">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-4 mb-6"
            >
              <div className="w-12 h-[1px] bg-red-600"></div>
              <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-red-600">
                Handpicked Catalogue
              </span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-[32px] md:text-[42px] lg:text-[52px] font-medium leading-[1.1] tracking-[-0.02em] uppercase text-gray-900"
            >
              Popular Products <br />
              <span className="text-gray-400 font-light">& Special Deals</span>
            </motion.h2>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              href="/products"
              className="group inline-flex items-center gap-3 border-b border-gray-300 hover:border-red-600 pb-2 text-[13px] font-bold uppercase tracking-widest text-gray-900 hover:text-red-600 transition-colors duration-300"
            >
              View All Products
              <FiArrowRight className="text-lg group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </motion.div>
        </div>

        {/* Products Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 lg:gap-x-8 gap-y-12 lg:gap-y-16"
        >
          {popularProducts.map((item: any) => (
            <ProductCardThree key={item.id} item={item} />
          ))}
        </motion.div>

      </div>
    </section>
  );
}
