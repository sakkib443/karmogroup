"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FiDelete } from "react-icons/fi";

import {
  estimateMattressPrice,
  formatTaka,
  sizePresets,
} from "@/components/karmo/product/productDetailData";

const EASE = [0.22, 1, 0.36, 1];

const FIELDS = [
  { id: "w", label: "W", full: "Width" },
  { id: "l", label: "L", full: "Length" },
  { id: "h", label: "H", full: "Height" },
];

const KEYS = ["7", "8", "9", "4", "5", "6", "1", "2", "3", "C", "0", "⌫"];

/**
 * Visual mattress calculator — tap pad on the PDP right rail.
 * Height is locked to the gallery frame so both columns read as one band.
 */
export default function ProductMattressCalculator({
  basePrice = 0,
  baseMrp = 0,
  onQuoteChange,
  className = "",
}) {
  const reduce = useReducedMotion();
  const queen = sizePresets.find((s) => s.id === "queen") || sizePresets[0];

  const [field, setField] = useState("w");
  const [dims, setDims] = useState({
    w: String(queen?.w || 150),
    l: String(queen?.l || 200),
    h: String(queen?.h || 22),
  });
  const [presetId, setPresetId] = useState(queen?.id || "queen");

  const unitPrice = useMemo(
    () => estimateMattressPrice(basePrice, dims.w, dims.l, dims.h),
    [basePrice, dims]
  );
  const mrpUnit = useMemo(() => {
    if (!baseMrp || !basePrice) return unitPrice;
    return Math.round(unitPrice * (baseMrp / basePrice));
  }, [baseMrp, basePrice, unitPrice]);

  const pushQuote = (nextDims) => {
    const price = estimateMattressPrice(
      basePrice,
      nextDims.w,
      nextDims.l,
      nextDims.h
    );
    const mrp =
      baseMrp && basePrice
        ? Math.round(price * (baseMrp / basePrice))
        : price;
    onQuoteChange?.({
      width: nextDims.w,
      length: nextDims.l,
      height: nextDims.h,
      sizeLabel: `${nextDims.w} × ${nextDims.l} × ${nextDims.h} inch`,
      unitPrice: price,
      mrpUnit: mrp,
    });
  };

  const setDim = (key, value, nextPreset = "custom") => {
    const next = { ...dims, [key]: value };
    setDims(next);
    setPresetId(nextPreset);
    pushQuote(next);
  };

  const applyPreset = (s) => {
    const next = {
      w: String(s.w),
      l: String(s.l),
      h: String(s.h),
    };
    setDims(next);
    setPresetId(s.id);
    setField("w");
    pushQuote(next);
  };

  const onKey = (key) => {
    const cur = dims[field] || "";
    if (key === "C") {
      setDim(field, "");
      return;
    }
    if (key === "⌫") {
      setDim(field, cur.slice(0, -1));
      return;
    }
    if (cur.length >= 3) return;
    if (key === "0" && cur === "0") return;
    const nextVal = cur === "0" ? key : `${cur}${key}`;
    setDim(field, nextVal);
  };

  const displayValue = dims[field] || "0";

  return (
    <div
      className={`flex h-[min(62svh,580px)] flex-col overflow-hidden border border-ink/12 bg-[#1a1a1a] text-white ${className}`}
    >
      {/* Screen */}
      <div className="relative shrink-0 border-b border-white/10 bg-[#111] px-4 pb-3 pt-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">
            Mattress calc
          </p>
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-brand">
            Matrexx
          </p>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-1.5">
          {FIELDS.map((f) => {
            const on = field === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setField(f.id)}
                className={`border px-2 py-2 text-left transition-colors ${
                  on
                    ? "border-brand bg-brand/20"
                    : "border-white/10 bg-white/[0.03] hover:border-white/25"
                }`}
              >
                <span className="block text-[9px] font-bold uppercase tracking-[0.14em] text-white/40">
                  {f.full}
                </span>
                <span className="mt-0.5 block text-[15px] font-bold tabular-nums">
                  {dims[f.id] || "—"}
                  <span className="ml-0.5 text-[10px] font-semibold text-white/35">
                    inch
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-3 border border-white/10 bg-black/40 px-3 py-2.5">
          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/35">
            Entering {FIELDS.find((f) => f.id === field)?.full}
          </p>
          <AnimatePresence mode="wait">
            <motion.p
              key={`${field}-${displayValue}`}
              initial={reduce ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: 0.18, ease: EASE }}
              className="display mt-0.5 text-right text-[2rem] font-light tabular-nums leading-none tracking-tight"
            >
              {displayValue}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="mt-3 flex items-end justify-between gap-2 border-t border-white/10 pt-3">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/35">
              Quote
            </p>
            <AnimatePresence mode="wait">
              <motion.p
                key={unitPrice}
                initial={reduce ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="display mt-1 text-[1.65rem] font-bold tabular-nums leading-none text-brand"
              >
                {formatTaka(unitPrice)}
              </motion.p>
            </AnimatePresence>
          </div>
          {mrpUnit > unitPrice ? (
            <s className="pb-1 text-[13px] tabular-nums text-white/30">
              {formatTaka(mrpUnit)}
            </s>
          ) : null}
        </div>
      </div>

      {/* Presets */}
      <div className="shrink-0 border-b border-white/10 px-3 py-2.5">
        <div className="grid grid-cols-4 gap-1">
          {sizePresets
            .filter((s) => s.id !== "custom")
            .map((s) => {
              const on = presetId === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => applyPreset(s)}
                  className={`py-2 text-[9px] font-bold uppercase tracking-[0.08em] transition-colors ${
                    on
                      ? "bg-brand text-white"
                      : "bg-white/5 text-white/70 hover:bg-white/10"
                  }`}
                >
                  {s.note}
                </button>
              );
            })}
        </div>
      </div>

      {/* Keypad */}
      <div className="grid min-h-0 flex-1 grid-cols-3 gap-px bg-white/10 p-px">
        {KEYS.map((key) => {
          const special = key === "C" || key === "⌫";
          return (
            <button
              key={key}
              type="button"
              onClick={() => onKey(key)}
              className={`flex items-center justify-center text-[1.15rem] font-semibold tabular-nums transition-colors active:scale-[0.98] ${
                special
                  ? "bg-[#2a2a2a] text-brand hover:bg-[#333]"
                  : "bg-[#222] text-white hover:bg-[#2c2c2c]"
              }`}
            >
              {key === "⌫" ? <FiDelete size={18} /> : key}
            </button>
          );
        })}
      </div>
    </div>
  );
}
