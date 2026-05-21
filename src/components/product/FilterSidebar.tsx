import { ALL_CATEGORIES, ALL_COLLECTIONS } from "@/lib/catalog";
import type { ProductFilters, SortOption } from "@/lib/catalog";
import { cn } from "@/lib/utils";

interface FilterSidebarProps {
  filters: ProductFilters;
  sort: SortOption;
  onFiltersChange: (f: ProductFilters) => void;
  onSortChange: (s: SortOption) => void;
  className?: string;
}

const FilterSidebar = ({
  filters,
  sort,
  onFiltersChange,
  onSortChange,
  className,
}: FilterSidebarProps) => {
  const set = (patch: Partial<ProductFilters>) =>
    onFiltersChange({ ...filters, ...patch });

  return (
    <aside
      className={cn(
        "rounded-2xl border border-[#7E1E1E]/10 bg-white p-5 sm:p-6 space-y-6",
        className,
      )}
    >
      <div>
        <h3 className="font-display text-lg font-bold text-[#7E1E1E] italic mb-4">Sort</h3>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="w-full h-11 px-3 rounded-xl border border-[#7E1E1E]/15 bg-[#F9F7F5] text-sm font-body focus:outline-none focus:ring-2 focus:ring-[#7E1E1E]/20"
        >
          <option value="popular">Popular First</option>
          <option value="newest">Newest First</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>

      <div>
        <h3 className="font-body text-xs uppercase tracking-[0.2em] text-[#7E1E1E]/50 mb-3">Price Range</h3>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.priceMin ?? ""}
            onChange={(e) =>
              set({ priceMin: e.target.value ? Number(e.target.value) : undefined })
            }
            className="w-full h-10 px-3 rounded-lg border border-[#7E1E1E]/15 text-sm font-body"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.priceMax ?? ""}
            onChange={(e) =>
              set({ priceMax: e.target.value ? Number(e.target.value) : undefined })
            }
            className="w-full h-10 px-3 rounded-lg border border-[#7E1E1E]/15 text-sm font-body"
          />
        </div>
      </div>

      <div>
        <h3 className="font-body text-xs uppercase tracking-[0.2em] text-[#7E1E1E]/50 mb-3">Category</h3>
        <select
          value={filters.category ?? ""}
          onChange={(e) => set({ category: e.target.value || undefined })}
          className="w-full h-10 px-3 rounded-lg border border-[#7E1E1E]/15 text-sm font-body bg-white"
        >
          <option value="">All Categories</option>
          {ALL_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="font-body text-xs uppercase tracking-[0.2em] text-[#7E1E1E]/50 mb-3">Collection</h3>
        <select
          value={filters.collection ?? ""}
          onChange={(e) => set({ collection: e.target.value || undefined })}
          className="w-full h-10 px-3 rounded-lg border border-[#7E1E1E]/15 text-sm font-body bg-white"
        >
          <option value="">All Collections</option>
          {ALL_COLLECTIONS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="font-body text-xs uppercase tracking-[0.2em] text-[#7E1E1E]/50 mb-3">Rating</h3>
        <select
          value={filters.minRating ?? ""}
          onChange={(e) =>
            set({ minRating: e.target.value ? Number(e.target.value) : undefined })
          }
          className="w-full h-10 px-3 rounded-lg border border-[#7E1E1E]/15 text-sm font-body bg-white"
        >
          <option value="">Any Rating</option>
          <option value="4">4+ Stars</option>
          <option value="4.5">4.5+ Stars</option>
        </select>
      </div>

      <div>
        <h3 className="font-body text-xs uppercase tracking-[0.2em] text-[#7E1E1E]/50 mb-3">Highlights</h3>
        <div className="flex flex-wrap gap-2">
          {(["New", "Trending", "Best Seller"] as const).map((badge) => (
            <button
              key={badge}
              type="button"
              onClick={() =>
                set({ badge: filters.badge === badge ? undefined : badge })
              }
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-body font-medium border transition-colors",
                filters.badge === badge
                  ? "bg-[#7E1E1E] text-white border-[#7E1E1E]"
                  : "border-[#7E1E1E]/20 text-[#7E1E1E]/70 hover:border-[#7E1E1E]/40",
              )}
            >
              {badge}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => onFiltersChange({})}
        className="w-full py-2 text-sm font-body text-[#7E1E1E]/60 hover:text-[#7E1E1E] underline"
      >
        Clear all filters
      </button>
    </aside>
  );
};

export default FilterSidebar;
