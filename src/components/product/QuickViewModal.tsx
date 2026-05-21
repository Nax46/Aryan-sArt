import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, ShoppingBag, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuickView } from "@/context/QuickViewContext";
import { getProductById } from "@/lib/catalog";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const QuickViewModal = () => {
  const { productId, closeQuickView } = useQuickView();
  const product = productId ? getProductById(productId) : null;
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const wished = product ? isInWishlist(product.id) : false;

  useEffect(() => {
    if (productId) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [productId]);

  const handleCart = () => {
    if (!product) return;
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      originalPrice: product.originalPrice,
    });
    closeQuickView();
  };

  const handleWishlist = () => {
    if (!product) return;
    toggleWishlist({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
  };

  return (
    <AnimatePresence>
      {productId && product && (
        <>
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-[#1a1010]/50 backdrop-blur-md"
            onClick={closeQuickView}
            aria-label="Close"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[130] w-[calc(100%-2rem)] max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-[0_32px_80px_rgba(62,24,24,0.25)] border border-[#7E1E1E]/10"
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              onClick={closeQuickView}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 text-[#7E1E1E] hover:bg-[#7E1E1E]/5"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="grid md:grid-cols-2 gap-0">
              <div className="aspect-square md:aspect-auto md:min-h-[360px] bg-[#F3EDE8]">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-6 sm:p-8 flex flex-col">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#7E1E1E]/50 font-body mb-1">
                  {product.category}
                </p>
                <h2 className="font-display text-2xl font-bold text-[#7E1E1E] italic mb-2">{product.name}</h2>
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-3.5 h-3.5",
                        i < Math.floor(product.rating)
                          ? "fill-amber-500 text-amber-500"
                          : "text-[#7E1E1E]/15",
                      )}
                    />
                  ))}
                  <span className="text-xs text-[#7E1E1E]/50 font-body ml-1">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="font-display text-2xl font-bold text-[#7E1E1E]">
                    ₹{product.price.toLocaleString("en-IN")}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-[#7E1E1E]/40 line-through">
                      ₹{product.originalPrice.toLocaleString("en-IN")}
                    </span>
                  )}
                </div>
                <p className="text-sm text-[#4A2511]/70 font-body leading-relaxed mb-6 flex-1">
                  {product.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={handleCart}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#7E1E1E] text-white font-body font-semibold text-sm hover:bg-[#6a1a1a]"
                  >
                    <ShoppingBag className="w-4 h-4" /> Add to Cart
                  </button>
                  <button
                    type="button"
                    onClick={handleWishlist}
                    className={cn(
                      "flex items-center justify-center gap-2 py-3 px-4 rounded-xl border font-body font-semibold text-sm transition-colors",
                      wished
                        ? "border-[#7E1E1E] bg-[#7E1E1E]/10 text-[#7E1E1E]"
                        : "border-[#7E1E1E]/20 text-[#7E1E1E]",
                    )}
                  >
                    <Heart className={cn("w-4 h-4", wished && "fill-current")} />
                  </button>
                </div>
                <Link
                  to={`/product/${product.id}`}
                  onClick={closeQuickView}
                  className="mt-4 text-center text-sm font-body text-[#7E1E1E] hover:underline"
                >
                  View full details →
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default QuickViewModal;
