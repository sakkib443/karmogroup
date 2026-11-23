/**
 * The text of the Description panel, one builder per product family. Everything here
 * comes from the catalogue data or copy Karmo supplied; nothing is made up per product.
 * Shape: { title, intro, sections: [{ heading, items: [{ label?, text }] }] }
 */

const facts = (rows) => rows.filter(([, text]) => text).map(([label, text]) => ({ label, text }));

/** Copy supplied by Karmo for the comforter range. */
export function comforterDescription(product) {
  return {
    title: `KARMO ${product.line}`,
    intro:
      "Experience ultimate luxury and sensational comfort with the KARMO Premium Comforter. Expertly crafted to deliver a peaceful, cozy sleep experience in all seasons, this comforter combines elegance, durability, and superior functionality, making it the perfect choice for homes, hotels, hospitals, and modern apartments, especially in air-conditioned rooms and during winter.",
    sections: [
      {
        heading: "Key Features & Benefits",
        items: facts([
          ["Premium Outer Fabric", "Crafted from high-quality 100% Polyester Microfiber (Virgin Fiber) / Premium Cotton Twill, featuring buffed-up sunfluorized fabric that offers an exceptionally soft touch, elegant finish, and long-lasting durability."],
          ["Finest Inner Filling", "Features 220 GSM (8 oz) Composite Processed Microfiber Padding, ensuring consistent loft, natural softness, smoothness, and superior warmth without feeling heavy."],
          ["Dry Comfort Technology", "Advanced breathable filling helps reduce humidity, keeping the comforter dry, fresh, and comfortable all night long."],
          ["Hygienic & Safe", "Designed with anti-allergic and anti-dust properties, along with smudge-free printing and a fragrance-free finish for healthy and irritation-free sleep."],
          ["Aesthetic & Modern Design", "Features fashionable quilting and attractive modern patterns that seamlessly complement any bedroom interior."],
          ["Durable & Easy Care", "Built for everyday use without losing its shape or softness. Washable and easy to maintain (dry wash recommended for long-lasting freshness)."],
        ]),
      },
      {
        heading: "Specifications",
        items: facts([
          ["Brand", "KARMO"],
          ["Product Type", "Comforter"],
          ["Print", product.print],
          ["Sold as", "1 piece"],
        ]),
      },
    ],
  };
}

export function foamDescription(product) {
  const c = product.catalogue || {};
  const sections = [];
  if (c.features?.length) sections.push({ heading: "Key Features", items: c.features.map((text) => ({ text })) });
  const specs = [
    ["Brand", "Karmo Foam"],
    ["Grade", c.grade],
    ["Colour", c.color],
    ["Size", c.piece],
    ...(c.technical || []).map((row) => [row.label, row.value]),
  ];
  sections.push({ heading: "Specifications", items: facts(specs) });
  const sizes = [...(c.setSizes || []), ...(c.bedSizes || [])];
  if (sizes.length) sections.push({ heading: "Sizes", items: sizes.map((text) => ({ text })) });
  return { title: product.name, intro: c.use || c.note || product.description, sections };
}

export function mattressDescription(product) {
  return {
    title: product.name,
    intro: product.description,
    sections: [
      {
        heading: "What's Inside",
        items: (product.build?.layers || []).map((layer) => ({ label: layer.title, text: layer.body })),
      },
      {
        heading: "Specifications",
        items: facts([
          ["Brand", "Karmo Matrexx"],
          ["Comfort", product.firmness],
          ["Details", (product.specs || []).join(" · ")],
          ["Sizes", "Standard sizes, or enter your own size above"],
        ]),
      },
      ...(product.featureBands?.length
        ? [{ heading: "Key Features", items: product.featureBands.map((f) => ({ label: f.title, text: f.body })) }]
        : []),
    ],
  };
}

export function pillowDescription(product, feelLabel) {
  const cushion = product.kind === "cushion";
  return {
    title: product.name,
    intro: product.summary,
    sections: [
      {
        heading: "Specifications",
        items: facts([
          ["Brand", "KARMO"],
          ["Line", product.line],
          ["Size", product.size],
          ["Feel", feelLabel],
          ["Sold as", product.pieces > 1 ? `${product.pieces} pieces` : "1 piece"],
          ["Fill", cushion ? "PP cotton" : null],
          ["Closure", cushion ? "Zip" : null],
        ]),
      },
    ],
  };
}
