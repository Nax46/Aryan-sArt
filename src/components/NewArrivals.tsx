import { useScrollFadeIn } from "@/hooks/useScrollFadeIn";
import { products } from "@/lib/data";
import ProductCard from "./ProductCard";

const NewArrivals = () => {
  const ref = useScrollFadeIn();

  return (
    <section id="arrivals" className="py-16 sm:py-24 px-4" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-body tracking-[0.3em] uppercase text-muted-foreground mb-2">
            Curated for You
          </p>
          <h2 className="text-3xl sm:text-4xl font-display font-light text-foreground">
            New Arrivals
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
          {products.slice(0, 8).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
