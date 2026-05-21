import { getTrendingProducts } from "@/lib/mockProducts";
import ProductSlider from "@/components/products/ProductSlider";
import SectionHeader from "./SectionHeader";

const Trending = () => (
  <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
    <div className="max-w-7xl mx-auto">
      <SectionHeader
        eyebrow="Popular Now"
        title="Trending"
        subtitle="Pieces our customers are loving this season."
        href="/home/trending"
      />
      <ProductSlider products={getTrendingProducts()} />
    </div>
  </section>
);

export default Trending;
