"use client";

import {
  TbShieldCheck,
  TbFeather,
  TbCertificate,
  TbDropletOff,
  TbArrowBigDownLines,
} from "react-icons/tb";

import FoamPromise from "@/components/karmo/home/FoamPromise";

/**
 * "Sleep Well, Live Well" — the three-claim trust band, reused on every division
 * page. `FoamPromise` already owns the dark film background, orange leaf rule
 * and solid middle card; this just forwards each division's heading, subline,
 * three claims and background clip. Design lives in `FoamPromise`.
 *
 * Claim icons arrive as STRING keys from the (server-serialisable) data files
 * and are resolved to real icon components here, on the client, before handing
 * them to `FoamPromise`. When `claims` is omitted, `FoamPromise` falls back to
 * its own default foam claims.
 */
const ICONS = {
  shield: TbShieldCheck,
  feather: TbFeather,
  certificate: TbCertificate,
  droplet: TbDropletOff,
  "arrow-down": TbArrowBigDownLines,
};

export default function DivisionPromise({
  heading,
  subline,
  claims,
  still,
  film,
  showFilm = true,
}) {
  const resolved = claims?.map((c) => ({
    ...c,
    icon: typeof c.icon === "string" ? ICONS[c.icon] ?? TbShieldCheck : c.icon,
  }));

  return (
    <div className="mb-[6px]">
      <FoamPromise
        heading={heading}
        subline={subline}
        claims={resolved}
        still={still}
        film={film}
        showFilm={showFilm}
      />
    </div>
  );
}
