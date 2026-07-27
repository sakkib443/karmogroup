"use client";

import { useCallback, useEffect, useRef } from "react";
import { FiX } from "react-icons/fi";

/**
 * The video overlay, shared by the film band and the reels row.
 *
 * Extracted rather than written twice: the parts that are easy to get wrong —
 * returning focus to whatever opened it, closing on Escape, locking the page
 * behind it — are exactly the parts that drift apart when they are duplicated.
 *
 * `onClose` is expected to also restore focus to the opener; the caller owns
 * that reference, so it is not guessed at here.
 */
export default function Lightbox({ src, label, onClose }) {
  const dialogRef = useRef(null);

  const close = useCallback(() => onClose(), [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    const onKey = (e) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [close]);

  return (
    <div
      className="media-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={label}
      ref={dialogRef}
      tabIndex={-1}
    >
      {/* The backdrop is its own button so a click anywhere outside the frame
          closes, without the video swallowing the event. */}
      <button
        type="button"
        className="media-lightbox-backdrop"
        aria-label="Close the video"
        onClick={close}
      />

      <div className="media-lightbox-frame">
        <button
          type="button"
          className="media-lightbox-close"
          onClick={close}
          aria-label="Close the video"
        >
          <FiX />
        </button>

        {/* Not muted — this one the visitor asked for. */}
        <video src={src} controls autoPlay playsInline />
      </div>
    </div>
  );
}
