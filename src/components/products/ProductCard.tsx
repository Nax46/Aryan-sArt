import { motion } from "framer-motion";
import { Eye, Heart, ShoppingBag, Star } from "lucide-react";
import { Link } from "react-router-dom";
import type { MockProduct } from "@/lib/mockProducts";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useQuickView } from "@/context/QuickViewContext";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: MockProduct;
  className?: string;
  index?: number;
}

const badgeStyles: Record<string, string> = {
  New: "bg-emerald-700/90 text-white",
  Trending: "bg-amber-700/90 text-white",
  "Best Seller": "bg-[#7E1E1E] text-white",
  "Limited Edition": "bg-[#4A2511] text-[#F9F7F5]",
};

const ProductCard = ({ product, className, index = 0 }: ProductCardProps) => {
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { openQuickView } = useQuickView();
  const wished = isInWishlist(product.id);

  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const handleCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      originalPrice: product.originalPrice,
    });
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openQuickView(product.id);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      className={cn("group h-full", className)}
    >
      <div className="relative h-full flex flex-col rounded-2xl border border-[#7E1E1E]/10 bg-white overflow-hidden shadow-[0_8px_30px_rgba(62,24,24,0.06)] hover:shadow-[0_20px_50px_rgba(62,24,24,0.12)] transition-shadow duration-500">
        <Link to={`/product/${product.id}`} className="block flex-1 flex flex-col">
          <div className="relative aspect-[4/5] overflow-hidden bg-[#F3EDE8]">
            <img
              src={product.image}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2a1810]/50 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

            {product.badge && (
              <span
                className={cn(
                  "absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider font-body",
                  badgeStyles[product.badge] ?? badgeStyles.New,
                )}
              >
                {product.badge}
              </span>
            )}
            {discount && (
              <span className="absolute top-3 right-3 z-10 px-2 py-1 rounded-full bg-white/95 text-[#7E1E1E] text-[10px] font-bold font-body">
                -{discount}%
              </span>
            )}

            <div className="absolute inset-x-0 bottom-0 p-3 flex gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
              <button
                type="button"
                onClick={handleQuickView}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/95 backdrop-blur text-[#4A2511] text-xs font-semibold font-body hover:bg-white transition-colors"
              >
                <Eye className="w-3.5 h-3.5" /> Quick View
              </button>
              <button
                type="button"
                onClick={handleCart}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#7E1E1E] text-white text-xs font-semibold font-body hover:bg-[#6a1a1a] transition-colors"
              >
                <ShoppingBag className="w-3.5 h-3.5" /> Add
              </button>
            </div>

            <button
              type="button"
              onClick={handleWishlist}
              className={cn(
                "absolute top-12 right-3 z-20 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300",
                wished
                  ? "bg-[#7E1E1E] text-white scale-110 animate-heart-pop"
                  : "bg-white/90 text-[#7E1E1E]/70 hover:text-[#7E1E1E] hover:scale-105",
              )}
              aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className={cn("w-4 h-4", wished && "fill-current")} />
            </button>
          </div>

          <div className="p-4 flex flex-col flex-1">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#7E1E1E]/45 font-body mb-1">
              {product.category}
            </p>
            <h3 className="font-body text-sm sm:text-base font-semibold text-[#4A2511] leading-snug mb-2 line-clamp-2 group-hover:text-[#7E1E1E] transition-colors">
              {product.name}
            </h3>

            <div className="flex items-center gap-1 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "w-3 h-3",
                    i < Math.floor(product.rating)
                      ? "fill-amber-500 text-amber-500"
                      : "fill-[#7E1E1E]/15 text-[#7E1E1E]/15",
                  )}
                />
              ))}
              <span className="text-[11px] text-[#7E1E1E]/50 font-body ml-1">
                {product.rating} ({product.reviewCount})
              </span>
            </div>

            <div className="mt-auto flex items-baseline gap-2">
              <span className="font-display text-lg font-bold text-[#7E1E1E]">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-[#7E1E1E]/40 line-through font-body">
                  ₹{product.originalPrice.toLocaleString("en-IN")}
                </span>
              )}
            </div>
          </div>
        </Link>
      </div>
    </motion.article>
  );
};

export default ProductCard;
