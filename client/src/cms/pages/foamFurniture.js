/**
 * Foam → Furniture & Upholstery (/foam/furniture) — the pictures and films staff can
 * change in Admin → Site content. Only media: the words, icons and products stay in
 * code (src/data/divisions/foamFurniture.js).
 *
 * Each section has the design's own picture as its default, and `apply` lays what was
 * published over the page's data before DivisionPage draws it.
 */
import { f, img } from "../fields";
import foamFurniture from "@/data/divisions/foamFurniture";

const d = foamFurniture;
const shape = d.shapeGrid || {};
const film = shape.inside?.photo || {};

/** The src of an image field, or the design's when nothing is set. */
const srcOf = (v, fallback) => (v && typeof v === "object" ? v.src : v) || fallback;
const altOf = (v, fallback) => (v && typeof v === "object" && v.alt) || fallback;

export const FOAM_FURNITURE_SECTIONS = [
  {
    key: "hero",
    label: "Hero",
    description: "The full-screen top of the page. A photo shows instead of the video while one is set.",
    fields: [f.image("image", "Hero photo"), f.video("video", "Hero video (used when there is no photo)")],
    defaults: {
      image: img(d.videoHero?.image || "", d.videoHero?.imageAlt || ""),
      video: { src: d.videoHero?.video || "", poster: "" },
    },
    apply: (data, v) => ({
      ...data,
      videoHero: {
        ...data.videoHero,
        image: srcOf(v.image, "") || undefined,
        imageAlt: altOf(v.image, data.videoHero?.imageAlt),
        video: srcOf(v.video, data.videoHero?.video),
      },
    }),
  },
  {
    key: "rooms",
    label: "Four room photos",
    description: "The four pictures under the icon strip.",
    fields: [f.list("items", "Photos", [f.image("image", "Photo"), f.text("label", "Label")], { fixed: true, itemLabel: (i) => i.label })],
    defaults: {
      items: (d.furnitureBrands?.sofas || []).map((s) => ({ image: img(s.src, s.alt), label: s.label })),
    },
    apply: (data, v) => ({
      ...data,
      furnitureBrands: {
        ...data.furnitureBrands,
        sofas: (data.furnitureBrands?.sofas || []).map((s, i) => {
          const it = v.items?.[i] || {};
          return { ...s, src: srcOf(it.image, s.src), alt: altOf(it.image, s.alt), label: it.label || s.label };
        }),
      },
    }),
  },
  {
    key: "lineup",
    label: "Large photo",
    description: "The full-width picture after the four room photos.",
    fields: [f.image("image", "Photo")],
    defaults: { image: img(d.furnitureGrades?.lineup || "", d.furnitureGrades?.alt || "") },
    apply: (data, v) => ({
      ...data,
      furnitureGrades: { ...data.furnitureGrades, lineup: srcOf(v.image, data.furnitureGrades?.lineup) },
    }),
  },
  {
    key: "spotlight",
    label: "Photo and video side by side",
    description: "The picture on the left and the video on the right.",
    fields: [f.image("image", "Left photo"), f.video("video", "Right video")],
    defaults: {
      image: img(shape.spotlight?.image || "", shape.spotlight?.alt || ""),
      video: { src: film.video || "", poster: film.src || "" },
    },
    apply: (data, v) => ({
      ...data,
      shapeGrid: {
        ...data.shapeGrid,
        spotlight: {
          ...data.shapeGrid?.spotlight,
          image: srcOf(v.image, data.shapeGrid?.spotlight?.image),
          alt: altOf(v.image, data.shapeGrid?.spotlight?.alt),
        },
        inside: {
          ...data.shapeGrid?.inside,
          photo: {
            ...data.shapeGrid?.inside?.photo,
            video: v.video?.src || data.shapeGrid?.inside?.photo?.video,
            src: v.video?.poster || data.shapeGrid?.inside?.photo?.src,
          },
        },
      },
    }),
  },
  {
    key: "lounge",
    label: "Large banner",
    description: "The big picture with “The comfort you feel every day”.",
    fields: [f.image("image", "Photo")],
    defaults: { image: img(d.lounge?.image?.src || "", d.lounge?.image?.alt || "") },
    apply: (data, v) => {
      const src = srcOf(v.image, data.lounge?.image?.src);
      const alt = altOf(v.image, data.lounge?.image?.alt);
      return {
        ...data,
        lounge: {
          ...data.lounge,
          image: { ...data.lounge?.image, src, alt },
          slides: (data.lounge?.slides || []).map((s) => ({ ...s, image: { ...s.image, src, alt } })),
        },
      };
    },
  },
];
