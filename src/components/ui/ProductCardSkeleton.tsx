import { cn } from "@/lib/utils";

const ProductCardSkeleton = ({ className }: { className?: string }) => (
  <div
    className={cn(
      "rounded-2xl border border-[#7E1E1E]/8 bg-white overflow-hidden animate-pulse",
      className,
    )}
  >
    <div className="aspect-[4/5] bg-[#7E1E1E]/8" />
    <div className="p-4 space-y-3">
      <div className="h-3 w-1/3 bg-[#7E1E1E]/10 rounded" />
      <div className="h-4 w-full bg-[#7E1E1E]/10 rounded" />
      <div className="h-4 w-2/3 bg-[#7E1E1E]/10 rounded" />
      <div className="h-5 w-1/4 bg-[#7E1E1E]/10 rounded mt-4" />
    </div>
  </div>
);

export default ProductCardSkeleton;
