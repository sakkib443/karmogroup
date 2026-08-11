/**
 * The gold leaf between two orange rules — the ornament under every centred
 * heading on Home 02.
 *
 * It is drawn inline in four homepage components (`DivisionsStrip`,
 * `CertifiedBy`, `OrderAndContact`, `FoamPromise`) because it predates having
 * anywhere to put it. The About page needs it in three places, so this folder
 * keeps one copy rather than adding three more. Same path data and same
 * colours as those four, so the mark is identical wherever it lands.
 */

const ORANGE = "#FF9A1F";

export default function LeafRule({ align = "center", className = "mt-4" }) {
  return (
    <span
      aria-hidden
      className={`flex items-center gap-3 ${
        align === "center" ? "justify-center" : "justify-start"
      } ${className}`}
    >
      <span className="h-px w-14 sm:w-20" style={{ backgroundColor: ORANGE }} />
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="shrink-0">
        <path
          d="M20.5 3.5C20.5 3.5 8.8 2.2 5.4 8.2c-2.6 4.6.6 9.4 4.6 10.3 4.6 1 8.6-2.4 9.6-7.3.6-3.1.9-7.7.9-7.7Z"
          fill={ORANGE}
        />
        <path
          d="M18.6 5.6C14.4 8.4 9.9 12.6 6.7 19.8"
          stroke="#B4651A"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </svg>
      <span className="h-px w-14 sm:w-20" style={{ backgroundColor: ORANGE }} />
    </span>
  );
}
