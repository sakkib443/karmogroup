import DivisionPage from "@/components/karmo/division/DivisionPage";
import foam from "@/data/divisions/foam";

export const metadata = {
  title: "Foam — Karmo Group",
  description:
    "Karmo Foam for furniture, footwear, automotive and specialty grades. Pure rubber-grade foam, made in Bangladesh since 1965.",
};

/**
 * `/foam` — Foam division catalogue (mattress-parity layout).
 */
export default function FoamRoute() {
  return <DivisionPage data={foam} />;
}
