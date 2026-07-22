export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(value) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
