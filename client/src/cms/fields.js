/**
 * Field definitions for Site content sections — what the admin editor shows for
 * each piece of a section, and the shape of the value it saves.
 *
 *   text      "string"              (opts.size: true → also "<key>Size", a percent)
 *   textarea  "string" (line breaks kept)
 *   image     { src, alt, fit: "cover"|"contain", x, y, zoom, width, height }
 *   video     { src, poster }
 *   media     image or video: { type: "image"|"video", src, poster, alt, fit, x, y, zoom }
 *   overlay   { color, opacity }      (opacity 0–100)
 *   link      { label, href }
 *   toggle    boolean
 *   select    one of opts.options [{ value, label }]
 *   range     number between opts.min and opts.max
 *   color     "#rrggbb"
 *   list      [ { …fields } ]         (opts.itemLabel, opts.max)
 *   group     { …fields }             (a titled box of fields)
 */
const make = (type) => (key, label, opts = {}) => ({ type, key, label, ...opts });

export const f = {
  text: make("text"),
  textarea: make("textarea"),
  image: make("image"),
  video: make("video"),
  media: make("media"),
  overlay: make("overlay"),
  link: make("link"),
  toggle: make("toggle"),
  select: make("select"),
  range: make("range"),
  color: make("color"),
  list: (key, label, fields, opts = {}) => ({ type: "list", key, label, fields, ...opts }),
  group: (key, label, fields, opts = {}) => ({ type: "group", key, label, fields, ...opts }),
};

/** "object-[50%_68%]" / "object-left" / "object-center" → { x, y }. */
export function pos(cls = "object-center") {
  const named = {
    "object-center": [50, 50], "object-left": [0, 50], "object-right": [100, 50],
    "object-top": [50, 0], "object-bottom": [50, 100],
  };
  if (named[cls]) return { x: named[cls][0], y: named[cls][1] };
  const m = /object-\[([^_\]]+)_([^\]]+)\]/.exec(cls);
  const word = { left: 0, center: 50, right: 100, top: 0, bottom: 100 };
  const n = (v) => (v in word ? word[v] : parseFloat(v));
  return m ? { x: n(m[1]), y: n(m[2]) } : { x: 50, y: 50 };
}

/** An image value with the design's defaults filled in. */
export const img = (src, alt = "", extra = {}) => ({ src, alt, fit: "cover", x: 50, y: 50, zoom: 100, ...extra });

/** Sections every page shares: show/hide is offered for each. */
export const sectionDefaults = (defaults) => ({ hidden: false, ...defaults });
