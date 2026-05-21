import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { searchProducts } from "@/lib/catalog";
import SearchSuggestions, { saveRecentSearch } from "@/components/product/SearchSuggestions";
import { cn } from "@/lib/utils";

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

const SearchOverlay = ({ open, onClose }: SearchOverlayProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const searchResults = useMemo(() => searchProducts(searchQuery), [searchQuery]);

  useEffect(() => {
    if (!open) {
      setSearchQuery("");
      return;
    }
    const timer = window.setTimeout(() => inputRef.current?.focus(), 100);
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const handleSelect = (productId: string) => {
    saveRecentSearch(searchQuery);
    setSearchQuery("");
    onClose();
    navigate(`/product/${productId}`);
  };

  const handleSearchTerm = (term: string) => {
    setSearchQuery(term);
    inputRef.current?.focus();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh] sm:pt-[15vh] px-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Search products"
    >
      <button
        type="button"
        className="absolute inset-0 bg-[#1a1010]/40 backdrop-blur-md"
        onClick={onClose}
        aria-label="Close search"
      />

      <div className="relative w-full max-w-2xl animate-in zoom-in-95 slide-in-from-top-4 duration-300">
        <div className="rounded-2xl border border-[#7E1E1E]/15 bg-white/95 backdrop-blur-xl shadow-[0_24px_64px_rgba(62,24,24,0.18)] overflow-hidden">
          <div className="flex items-center gap-3 px-4 sm:px-6 py-4 border-b border-[#7E1E1E]/10">
            <Search className="w-5 h-5 text-[#7E1E1E]/50 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search lamps, wall art, clocks..."
              className="flex-1 bg-transparent text-base sm:text-lg font-body text-[#4A2511] placeholder:text-[#7E1E1E]/35 focus:outline-none"
            />
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-[#7E1E1E]/60 hover:text-[#7E1E1E] hover:bg-[#7E1E1E]/5 transition-all duration-300"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <SearchSuggestions
            query={searchQuery}
            results={searchResults}
            onSelect={handleSelect}
            onSearchTerm={handleSearchTerm}
          />
        </div>

        <p className="mt-4 text-center text-xs text-white/80 font-body tracking-wide">
          Press <kbd className={cn("px-1.5 py-0.5 rounded bg-white/20")}>Esc</kbd> to close
        </p>
      </div>
    </div>
  );
};

export default SearchOverlay;
