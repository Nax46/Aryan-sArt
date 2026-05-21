import { getNewArrivals } from "@/lib/mockProducts";
import ProductCard from "@/components/products/ProductCard";
import SectionHeader from "./SectionHeader";

const NewArrivals = () => (
  <section id="arrivals" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto">
      <SectionHeader
        eyebrow="Just Landed"
        title="New Arrivals"
        subtitle="Fresh designs from our Bundi workshop — limited batches."
        href="/home/new-arrivals"
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {getNewArrivals().map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </div>
  </section>
);

export default NewArrivals;
