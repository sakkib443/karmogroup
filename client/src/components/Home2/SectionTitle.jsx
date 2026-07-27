"use client";

import { FadeUp, SplitWords } from "./motion";

/**
 * The heading block every section opens with.
 *
 * Two shapes, both from Home 01:
 *
 *   • `title` alone     — one bold statement, the reference's default.
 *   • `title` + `bold`  — Home 01's two-weight heading, where the opening
 *                         clause is set light and the payload lands bold
 *                         ("One group, one standard, **four things to sell**").
 *                         The weight change does the emphasis, so the line
 *                         needs no colour or size trick to carry it.
 *
 * The eyebrow above is a red rule and small caps — Home 01's marker, used here
 * in place of the reference's dotted pill.
 */
export default function SectionTitle({
  sub,
  title,
  bold,
  text,
  center = false,
  as = "h2",
}) {
  return (
    <div className={`section-title${center ? " section-title-center" : ""}`}>
      <FadeUp>
        <span className="section-sub-title">{sub}</span>
      </FadeUp>

      {bold ? (
        // Both halves are inline spans inside one heading element, so the line
        // wraps as a single sentence rather than breaking at the weight change.
        <h2 className="section-heading">
          <SplitWords as="span" text={title} className="heading-light" />{" "}
          <SplitWords
            as="span"
            text={bold}
            className="heading-bold"
            delay={title.split(" ").length * 0.055}
          />
        </h2>
      ) : (
        <SplitWords as={as} text={title} />
      )}

      {text && (
        <FadeUp delay={0.1}>
          <p>{text}</p>
        </FadeUp>
      )}
    </div>
  );
}
