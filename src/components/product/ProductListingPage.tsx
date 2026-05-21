import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { SlidersHorizontal } from "lucide-react";
import type { ProductFilters, SortOption } from "@/lib/catalog";
import { filterAndSortProducts } from "@/lib/catalog";
import { mockProductFromStore } from "@/lib/catalogUtils";
import ProductCard from "@/components/products/ProductCard";
import FilterSidebar from "./FilterSidebar";
import { cn } from "@/lib/utils";

interface ProductListingPageProps {
  title: string;
  subtitle?: string;
  initialFilters?: ProductFilters;
  initialSort?: SortOption;
}

const ProductListingPage = ({
  title,
  subtitle,
  initialFilters = {},
  initialSort = "popular",
}: ProductListingPageProps) => {
  const [filters, setFilters] = useState<ProductFilters>(initialFilters);
  const [sort, setSort] = useState<SortOption>(initialSort);
  const [mobileFilters, setMobileFilters] = useState(false);

  const products = useMemo(
    () => filterAndSortProducts(filters, sort),
    [filters, sort],
  );

  return (
    <div>
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 sm:mb-10"
      >
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#7E1E1E] italic">{title}</h1>
        {subtitle && (
          <p className="mt-2 text-sm text-[#4A2511]/65 font-body max-w-2xl">{subtitle}</p>
        )}
        <p className="mt-3 text-xs font-body text-[#7E1E1E]/50">{products.length} products</p>
      </motion.header>

      <button
        type="button"
        onClick={() => setMobileFilters((v) => !v)}
        className="lg:hidden flex items-center gap-2 mb-4 px-4 py-2.5 rounded-xl border border-[#7E1E1E]/15 text-sm font-body text-[#7E1E1E]"
      >
        <SlidersHorizontal className="w-4 h-4" /> Filters & Sort
      </button>

      <div className="flex flex-col lg:flex-row gap-8">
        <FilterSidebar
          filters={filters}
          sort={sort}
          onFiltersChange={setFilters}
          onSortChange={setSort}
          className={cn(
            "lg:w-64 shrink-0",
            mobileFilters ? "block" : "hidden lg:block",
          )}
        />

        {products.length === 0 ? (
          <div className="flex-1 py-20 text-center rounded-2xl border border-dashed border-[#7E1E1E]/20">
            <p className="font-display text-xl text-[#7E1E1E]/60 italic">No products match your filters</p>
          </div>
        ) : (
          <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={mockProductFromStore(p)} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductListingPage;
