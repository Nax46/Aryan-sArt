import { Clock, Search, TrendingUp } from "lucide-react";
import type { StoreProduct } from "@/lib/catalog";

const POPULAR_SEARCHES = [
  "Wooden Lamp",
  "Wall Art",
  "Clock",
  "Home Decor",
  "Personalized Gifts",
];

const RECENT_KEY = "oncanvas_recent_searches";

export function getRecentSearches(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveRecentSearch(query: string) {
  const q = query.trim();
  if (!q) return;
  const recent = getRecentSearches().filter((r) => r !== q);
  localStorage.setItem(RECENT_KEY, JSON.stringify([q, ...recent].slice(0, 6)));
}

interface SearchSuggestionsProps {
  query: string;
  results: StoreProduct[];
  onSelect: (productId: string) => void;
  onSearchTerm: (term: string) => void;
}

const SearchSuggestions = ({
  query,
  results,
  onSelect,
  onSearchTerm,
}: SearchSuggestionsProps) => {
  const recent = getRecentSearches();
  const trimmed = query.trim();

  if (!trimmed) {
    return (
      <div className="p-4 space-y-6">
        <div>
          <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#7E1E1E]/45 font-body mb-3">
            <TrendingUp className="w-3.5 h-3.5" /> Popular searches
          </p>
          <div className="flex flex-wrap gap-2">
            {POPULAR_SEARCHES.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => onSearchTerm(term)}
                className="px-3 py-1.5 rounded-full bg-[#7E1E1E]/5 text-sm font-body text-[#7E1E1E]/80 hover:bg-[#7E1E1E]/10 transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
        {recent.length > 0 && (
          <div>
            <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#7E1E1E]/45 font-body mb-3">
              <Clock className="w-3.5 h-3.5" /> Recent searches
            </p>
            <ul className="space-y-1">
              {recent.map((term) => (
                <li key={term}>
                  <button
                    type="button"
                    onClick={() => onSearchTerm(term)}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm font-body text-[#4A2511]/75 hover:bg-[#7E1E1E]/5"
                  >
                    {term}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <p className="text-center text-sm text-[#7E1E1E]/45 font-body italic pt-2">
          Start typing to discover handcrafted wooden pieces
        </p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="p-10 text-center">
        <Search className="w-10 h-10 text-[#7E1E1E]/20 mx-auto mb-3" />
        <p className="text-sm text-[#7E1E1E]/60 font-body">
          No results for &ldquo;{trimmed}&rdquo;
        </p>
        <p className="text-xs text-[#7E1E1E]/40 font-body mt-2">Try a popular category above</p>
      </div>
    );
  }

  return (
    <ul className="p-2 sm:p-3 max-h-[50vh] overflow-y-auto">
      {results.map((product) => (
        <li key={product.id}>
          <button
            type="button"
            onClick={() => onSelect(product.id)}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#7E1E1E]/5 transition-colors text-left"
          >
            <div className="w-12 h-12 rounded-lg bg-[#F9F7F5] overflow-hidden shrink-0">
              <img src={product.image} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#4A2511] truncate">{product.name}</p>
              <p className="text-[10px] text-[#7E1E1E]/50 uppercase tracking-widest">{product.category}</p>
            </div>
            <p className="text-sm font-semibold text-[#7E1E1E] shrink-0">
              ₹{product.price.toLocaleString("en-IN")}
            </p>
          </button>
        </li>
      ))}
    </ul>
  );
};

export default SearchSuggestions;
