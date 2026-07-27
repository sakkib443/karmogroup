"use client";

import { useState } from "react";

// The shared look, appended to every prompt so the whole set matches. Same
// wording as IMAGE-PROMPTS.md.
const HOUSE_STYLE =
  "warm editorial interior photography, soft natural window light, calm premium mood, muted warm-neutral palette (linen, oatmeal, warm grey, walnut wood, off-white) with one small deep-red accent, shallow depth of field, shot on a 50mm lens, fine detail, photorealistic, clean and uncluttered, no text, no logo, no watermark, no brand names";

// One-click starting points, straight from IMAGE-PROMPTS.md.
const PRESETS = [
  {
    label: "Hero — Foam",
    ar: "16:9",
    file: "hero-foam",
    prompt:
      "A bright, airy living room in a modern South-Asian apartment, a low linen-upholstered sofa with deep plush cushions, soft morning light raking across the seat, a lot of empty wall and floor space on the left of the frame, one small rust-red throw cushion as the only colour accent",
  },
  {
    label: "Hero — Mattress",
    ar: "16:9",
    file: "hero-mattress",
    prompt:
      "A serene bedroom at soft dawn light, a neatly made bed with a thick quilted mattress on a low walnut frame, crisp white bedding, sheer curtains glowing, calm and restful, wide empty space on the left for a headline",
  },
  {
    label: "Hero — HomeTex",
    ar: "16:9",
    file: "hero-hometex",
    prompt:
      "A styled bed dressed in layered premium bedding — sateen sheets, a soft comforter, stacked pillows — in a warm minimalist bedroom, gentle side light, rich inviting textures, generous negative space on the left",
  },
  {
    label: "Division — Foam",
    ar: "4:3",
    file: "division-foam",
    prompt:
      "Stacked blocks of high-density upholstery foam in a clean bright workshop, precise cut edges, one block resting on a linen sofa cushion to show use, warm daylight, industrial but premium",
  },
  {
    label: "Division — Mattress",
    ar: "4:3",
    file: "division-mattress",
    prompt:
      "A beauty shot of a quilted pocket-spring mattress edge on a walnut bed frame in a calm bedroom, showing the plush top layer and firm support, soft directional light",
  },
  {
    label: "Division — HomeTex",
    ar: "4:3",
    file: "division-hometex",
    prompt:
      "A flat-lay of folded premium bed linen and a soft pillow on an oatmeal surface, subtle floral-print sheet, warm neutral tones, one thin red seam as an accent, top-down soft light",
  },
  {
    label: "Division — Chemicals",
    ar: "4:3",
    file: "division-chemicals",
    prompt:
      "A clean modern industrial detail — pale polyurethane foam sheets and neat canisters on a stainless surface in a bright plant, precise and technical, cool neutral light with a warm edge, no clutter",
  },
  {
    label: "Spotlight — Mattress test",
    ar: "4:3",
    file: "spotlight-mattress",
    prompt:
      "Close-up of a hand pressing gently into the quilted surface of a premium mattress, showing the give and rebound of the foam, soft window light, shallow focus, calm and reassuring",
  },
  {
    label: "WhyKarmo — background",
    ar: "4:3",
    file: "why-background",
    prompt:
      "A quiet softly-lit bedroom interior with a made bed and warm textures, muted, plenty of dark shadow area so text reads on top, cinematic and calm",
  },
  {
    label: "Best Seller — product",
    ar: "3:4",
    file: "bestseller-product",
    prompt:
      "A single hero mattress on a simple walnut platform bed against a warm plain wall, centred, even studio daylight, catalogue style, lots of clean space around the product, one soft shadow",
  },
];

const RATIOS = ["16:9", "4:3", "3:4", "1:1", "9:16"];
const MODELS = [
  { value: "imagen-4.0-generate-001", label: "Imagen 4 — best quality" },
  { value: "imagen-4.0-ultra-generate-001", label: "Imagen 4 Ultra" },
  { value: "imagen-3.0-generate-002", label: "Imagen 3 — stable / free tier" },
];

export default function StudioPage() {
  const [prompt, setPrompt] = useState(PRESETS[0].prompt);
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [model, setModel] = useState(MODELS[0].value);
  const [count, setCount] = useState(1);
  const [filename, setFilename] = useState("hero-foam");
  const [appendStyle, setAppendStyle] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const applyPreset = (label) => {
    const p = PRESETS.find((x) => x.label === label);
    if (!p) return;
    setPrompt(p.prompt);
    setAspectRatio(p.ar);
    setFilename(p.file);
  };

  const generate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const finalPrompt = appendStyle ? `${prompt}. ${HOUSE_STYLE}` : prompt;
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: finalPrompt,
          aspectRatio,
          model,
          count,
          filename,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.hint ? `${data.error}\n${data.hint}` : data.error);
      } else {
        setResult(data);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f4f2ef] px-5 py-10 text-[#222] md:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#e60000]">
            Karmo · internal tool
          </span>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Image studio</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-black/60">
            Generate section imagery with Google Imagen. Files save straight to{" "}
            <code className="rounded bg-black/5 px-1.5 py-0.5">
              public/images/generated/
            </code>{" "}
            — ready to wire into the site. Keep this page off the public build.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          {/* Controls */}
          <section className="space-y-5 rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-black/50">
                Section preset
              </span>
              <select
                onChange={(e) => applyPreset(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-black/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#e60000]"
                defaultValue={PRESETS[0].label}
              >
                {PRESETS.map((p) => (
                  <option key={p.label}>{p.label}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-black/50">
                Prompt
              </span>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={6}
                className="mt-1.5 w-full resize-y rounded-lg border border-black/15 bg-white px-3 py-2.5 text-sm leading-relaxed outline-none focus:border-[#e60000]"
              />
            </label>

            <label className="flex items-center gap-2.5 text-sm">
              <input
                type="checkbox"
                checked={appendStyle}
                onChange={(e) => setAppendStyle(e.target.checked)}
                className="h-4 w-4 accent-[#e60000]"
              />
              Append the shared house style automatically
            </label>

            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wide text-black/50">
                  Aspect ratio
                </span>
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-black/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#e60000]"
                >
                  {RATIOS.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wide text-black/50">
                  Variations
                </span>
                <select
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="mt-1.5 w-full rounded-lg border border-black/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#e60000]"
                >
                  {[1, 2, 3, 4].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-black/50">
                Model
              </span>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-black/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#e60000]"
              >
                {MODELS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-black/50">
                File name (saved as .png)
              </span>
              <input
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-black/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#e60000]"
              />
            </label>

            <button
              onClick={generate}
              disabled={loading}
              className="w-full rounded-lg bg-[#e60000] px-5 py-3 text-sm font-bold uppercase tracking-wide text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Generating…" : "Generate"}
            </button>

            {error && (
              <p className="whitespace-pre-line rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}
          </section>

          {/* Results */}
          <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-black/50">
              Result
            </h2>

            {!result && !loading && (
              <p className="mt-4 text-sm text-black/40">
                Generated images appear here and are saved to the project.
              </p>
            )}

            {loading && (
              <div className="mt-4 aspect-video w-full animate-pulse rounded-xl bg-black/5" />
            )}

            {result && (
              <div className="mt-4 space-y-5">
                <p className="text-xs text-black/50">
                  {result.model} · {result.aspectRatio}
                </p>
                {result.images.map((img) => (
                  <figure key={img.path} className="space-y-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.dataUrl}
                      alt=""
                      className="w-full rounded-xl border border-black/10"
                    />
                    <figcaption className="flex items-center justify-between gap-3 text-xs">
                      <code className="truncate rounded bg-black/5 px-2 py-1">
                        {img.path}
                      </code>
                      <a
                        href={img.dataUrl}
                        download={img.path.split("/").pop()}
                        className="shrink-0 font-semibold text-[#e60000] hover:underline"
                      >
                        Download
                      </a>
                    </figcaption>
                  </figure>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
