import { getFeaturedProducts } from "@/lib/mockProducts";
import ProductCard from "@/components/products/ProductCard";
import SectionHeader from "./SectionHeader";

const FeaturedProducts = () => {
  const products = getFeaturedProducts();

  return (
    <section id="featured" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#F9F7F5]/50">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="Curated Selection"
          title="Featured Products"
          subtitle="Twelve handcrafted wooden pieces chosen for quality, character, and timeless appeal."
          href="/home/featured-products"
        />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
