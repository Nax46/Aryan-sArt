import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { MockProduct } from "@/lib/mockProducts";
import ProductCard from "./ProductCard";
import { cn } from "@/lib/utils";

interface ProductSliderProps {
  products: MockProduct[];
  className?: string;
}

const ProductSlider = ({ products, className }: ProductSliderProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.85;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => scroll("left")}
        className="hidden md:flex absolute -left-4 lg:-left-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 items-center justify-center rounded-full bg-white border border-[#7E1E1E]/15 text-[#7E1E1E] shadow-lg hover:bg-[#7E1E1E] hover:text-white transition-all duration-300"
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={() => scroll("right")}
        className="hidden md:flex absolute -right-4 lg:-right-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 items-center justify-center rounded-full bg-white border border-[#7E1E1E]/15 text-[#7E1E1E] shadow-lg hover:bg-[#7E1E1E] hover:text-white transition-all duration-300"
        aria-label="Scroll right"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div
        ref={scrollRef}
        className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none -mx-1 px-1"
      >
        {products.map((product, index) => (
          <div
            key={product.id}
            className="flex-shrink-0 w-[72vw] sm:w-[45vw] md:w-[32vw] lg:w-[24vw] max-w-[300px] snap-start"
          >
            <ProductCard product={product} index={index} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSlider;
