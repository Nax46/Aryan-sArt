import { Truck, Hand, Leaf, RotateCcw } from "lucide-react";
import { useScrollFadeIn } from "@/hooks/useScrollFadeIn";

const items = [
  { icon: Truck, label: "Free Shipping", sub: "Above ₹999" },
  { icon: Hand, label: "Artisan Crafted", sub: "Finished by hand" },
  { icon: Leaf, label: "Sustainable", sub: "Eco-friendly materials" },
  { icon: RotateCcw, label: "Easy Returns", sub: "7-day returns" },
];

const TrustStrip = () => {
  const ref = useScrollFadeIn();

  return (
    <section className="border-y border-border py-10 sm:py-14 px-4" ref={ref}>
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {items.map(({ icon: Icon, label, sub }) => (
          <div key={label} className="text-center">
            <Icon className="w-6 h-6 mx-auto mb-3 text-primary" strokeWidth={1.5} />
            <p className="font-body text-sm font-medium text-foreground">{label}</p>
            <p className="font-body text-xs text-muted-foreground mt-1">{sub}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrustStrip;
