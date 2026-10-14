"use client";

/**
 * The content of the page being shown, for its sections to read with useSection().
 *
 *   <CmsScope page="home" content={…}>   — wraps a page (content fetched on the server)
 *   <CmsScope page="global" content={…}> — wraps the whole site (logo, contact…)
 *
 * Inside Admin → Site content the page is shown in an <iframe> with ?cmsPreview=1.
 * Then each scope listens for the editor's unsaved content (postMessage, same origin
 * only) and re-renders at once — the live preview.
 */
import { createContext, createElement, useContext, useEffect, useMemo, useState } from "react";
import { mergeSection, textScale } from "./core";

const PageCtx = createContext({ page: null, content: {} });
const GlobalCtx = createContext({ page: "global", content: {} });

function usePreviewContent(page, initial) {
  const [content, setContent] = useState(initial || {});
  useEffect(() => {
    if (typeof window === "undefined" || window.parent === window) return;
    if (!new URLSearchParams(window.location.search).has("cmsPreview")) return;
    const onMessage = (e) => {
      if (e.origin !== window.location.origin) return;
      const d = e.data || {};
      if (d.type === "karmo-cms:content" && d.page === page) setContent(d.content || {});
      if (d.type === "karmo-cms:focus" && page !== "global" && d.section) {
        const el = document.querySelector(`[data-cms-section="${CSS.escape(d.section)}"]`);
        if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 100, behavior: "smooth" });
      }
    };
    window.addEventListener("message", onMessage);
    window.parent.postMessage({ type: "karmo-cms:ready", page }, window.location.origin);
    return () => window.removeEventListener("message", onMessage);
  }, [page]);
  return content;
}

export function CmsScope({ page, content, children }) {
  const live = usePreviewContent(page, content);
  const value = useMemo(() => ({ page, content: live || {} }), [page, live]);
  return createElement(page === "global" ? GlobalCtx.Provider : PageCtx.Provider, { value }, children);
}

/**
 * A section's content: its defaults with whatever was edited laid over them.
 * `defaults` must be a stable (module-level) object.
 */
export function useSection(key, defaults) {
  const { content } = useContext(PageCtx);
  const saved = content?.[key];
  return useMemo(() => mergeSection(defaults, saved), [defaults, saved]);
}

/** Site-wide content (Brand & contact). */
export function useGlobal(key, defaults) {
  const { content } = useContext(GlobalCtx);
  const saved = content?.[key];
  return useMemo(() => mergeSection(defaults, saved), [defaults, saved]);
}

/**
 * Text from the editor, with its optional size (percent) and line breaks kept.
 *   <CmsText value={c.title} size={c.titleSize} />
 */
export function CmsText({ value, size, as = "span", className, style }) {
  if (value == null || value === "") return null;
  const scaled = textScale(size);
  return createElement(as, { className, style: { whiteSpace: "pre-line", ...scaled, ...style } }, value);
}
