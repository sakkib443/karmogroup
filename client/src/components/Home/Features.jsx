import { FiAward, FiLayers, FiMapPin, FiShield } from "react-icons/fi";

const points = [
  {
    icon: FiAward,
    title: "Since 1965",
    description: "Six decades of manufacturing in Bangladesh.",
  },
  {
    icon: FiLayers,
    title: "Four divisions",
    description: "Foam, mattress, HomeTex and chemicals under one group.",
  },
  {
    icon: FiShield,
    title: "Made to standard",
    description: "Density and durability tested batch by batch.",
  },
  {
    icon: FiMapPin,
    title: "Nationwide dealers",
    description: "Stockists and showrooms across the country.",
  },
];

export default function Features() {
  return (
    <section className="border-b border-sand bg-cream">
      <div className="shell grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {points.map((point) => (
          <div key={point.title} className="flex items-start gap-4">
            <point.icon className="mt-0.5 shrink-0 text-2xl text-brand" />
            <div>
              <h3 className="text-sm font-semibold text-ink">{point.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink/60">
                {point.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
