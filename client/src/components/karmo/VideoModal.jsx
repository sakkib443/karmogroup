"use client";

import { useCallback, useEffect, useRef } from "react";
import { FiX } from "react-icons/fi";

/**
 * The overlay a video opens into, shared by the film band and the reels strip.
 *
 * Extracted rather than written twice: the parts that are easy to get wrong —
 * returning focus to whatever opened it, closing on Escape, locking the page
 * behind it — are exactly the parts that drift apart when they are duplicated.
 *
 * `onClose` is expected to also restore focus to the opener; the caller owns
 * that reference, so it is not guessed at here.
 *
 * Square corners throughout. The client does not want rounded ones.
 */
export default function VideoModal({ src, label, caption, onClose }) {
  const dialogRef = useRef(null);

  const close = useCallback(() => onClose(), [onClose]);

  useEffect(() => {
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    const onKey = (e) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [close]);

  return (
    <div
      className="fixed inset-0 z-[9990] grid place-items-center p-4 sm:p-6"
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
        onClick={close}
        aria-label="Close the video"
        className="absolute inset-0 h-full w-full cursor-pointer bg-[rgb(10_13_17/0.9)] backdrop-blur-[6px]"
      />

      <div className="relative w-[min(1100px,100%)] shadow-[0_40px_90px_-40px_rgba(0,0,0,0.8)]">
        <button
          type="button"
          onClick={close}
          aria-label="Close the video"
          className="absolute right-3 top-3 z-10 grid h-11 w-11 place-items-center bg-black/45 text-xl text-white transition-colors duration-300 hover:bg-brand"
        >
          <FiX />
        </button>

        {/* Not muted — this one the visitor asked for. Controls too: in the
            strip there is nothing to press, so the modal is where scrubbing,
            volume and full screen live. */}
        <video
          src={src}
          controls
          autoPlay
          playsInline
          className="block max-h-[80vh] w-full bg-black"
        />

        {caption && (
          <p className="mt-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-white/70">
            {caption}
          </p>
        )}
      </div>
    </div>
  );
}
