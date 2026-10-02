/**
 * Marks a block of the page as one reviewable section.
 *
 * `display: contents` means this wrapper generates no box at all: layout,
 * margins, sticky/fixed children and every `section + section` rule behave
 * exactly as if it were not there. <ReviewLayer> finds these wrappers by
 * `data-review-id` and draws the left-edge marker + approval bar for each.
 */
export default function ReviewSection({ id, children }) {
  return (
    <div data-review-id={id} style={{ display: "contents" }}>
      {children}
    </div>
  );
}
