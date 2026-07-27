"use client";

import Link from "next/link";
import Image from "next/image";
import { FiCalendar } from "react-icons/fi";
import SectionTitle from "./SectionTitle";
import { FadeUp, Reveal } from "./motion";

/**
 * The blog band — Home 01's Journal, mirrored.
 *
 * Home 01 puts the standing panel on the right of its carousel. Here it moves
 * to the left, which is what the layout wanted anyway: this page reads
 * left-to-right into the posts, and every other section on it opens with a
 * picture rather than ending on one.
 *
 * Posts, dates and excerpts are Home 01's. They are placeholder editorial —
 * written for the design, not supplied by Karmo — so the hrefs point at
 * /blog/* routes that do not exist yet. Worth replacing with real posts before
 * launch rather than shipping four articles nobody wrote.
 */
const PANEL = {
  title: ["Design your comfort", "with Karmo experts"],
  cta: "Let's get started",
  href: "/contact",
  src: "/images/products/journal-panel.jpg",
  alt: "Living-room corner with a linen sofa, cushions and a carved side table",
};

const POSTS = [
  {
    title: "How foam density actually decides how long a mattress lasts",
    href: "/blog/foam-density",
    src: "/images/mattress/plant-bedroom.jpg",
    alt: "Karmo mattress in a plant-filled bedroom",
    date: "12 June 2026",
    author: "Karmo Desk",
    excerpt:
      "Density is not firmness. The number on the label tells you how much material is packed into every cubic foot — and that is what decides whether a mattress holds its shape after five years.",
  },
  {
    title: "Inside the plant: what a batch test looks like",
    href: "/blog/batch-testing",
    src: "/images/mattress/cloud-poster.jpg",
    alt: "Karmo mattress photographed above a bank of cloud",
    date: "09 May 2026",
    author: "Karmo Desk",
    excerpt:
      "Every pour is sampled before it becomes a product. We walk through the density, resilience and compression checks that a batch has to clear before it leaves the floor.",
  },
];

export default function Journal() {
  return (
    <div className="our-blog">
      <div className="container">
        <SectionTitle sub="Our blog" title="Follow the" bold="latest news" />

        <div className="blog-row">
          {/* Standing panel. Does not scroll, does not link to a post — it is
              the section's call to action, sized like a card so the row reads
              as one set. */}
          <Reveal className="blog-panel">
            <Image
              src={PANEL.src}
              alt={PANEL.alt}
              fill
              sizes="(min-width: 1024px) 30vw, 100vw"
            />
            <span className="blog-panel-veil" aria-hidden="true" />

            <div className="blog-panel-content">
              <h3>
                {PANEL.title.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h3>
              <Link href={PANEL.href} className="blog-underline-btn">
                {PANEL.cta}
                <span className="rule">
                  <span />
                </span>
              </Link>
            </div>
          </Reveal>

          {POSTS.map((post, i) => (
            <FadeUp key={post.href} delay={0.1 + i * 0.1} className="blog-post">
              <Link href={post.href}>
                <div className="blog-post-image">
                  <Image
                    src={post.src}
                    alt={post.alt}
                    fill
                    sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
                  />
                </div>

                <h3>{post.title}</h3>

                <div className="blog-post-meta">
                  <span>
                    <i>
                      <FiCalendar />
                    </i>
                    {post.date}
                  </span>
                  <span className="dot" aria-hidden="true" />
                  <span>
                    By <strong>{post.author}</strong>
                  </span>
                </div>

                <p>{post.excerpt}</p>

                <span className="blog-underline-btn">
                  Read more
                  <span className="rule">
                    <span />
                  </span>
                </span>
              </Link>
            </FadeUp>
          ))}
        </div>
      </div>
    </div>
  );
}
