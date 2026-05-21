import { getBestSellers } from "@/lib/mockProducts";
import ProductCard from "@/components/products/ProductCard";
import SectionHeader from "./SectionHeader";

const BestSellers = () => (
  <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-[#F3EDE8]/40">
    <div className="max-w-7xl mx-auto">
      <SectionHeader
        eyebrow="Customer Favorites"
        title="Best Sellers"
        subtitle="Our most gifted and reviewed wooden decor pieces."
        href="/home/best-sellers"
      />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {getBestSellers().map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </div>
  </section>
);

export default BestSellers;
