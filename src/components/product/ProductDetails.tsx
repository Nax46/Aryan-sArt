import { useState } from "react";
import { motion } from "framer-motion";
import { Share2, ShoppingBag, Star, Truck, Shield, RotateCcw, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import type { StoreProduct } from "@/lib/catalog";
import { getRelatedProducts } from "@/lib/catalog";
import ProductGallery from "./ProductGallery";
import ProductCard from "@/components/products/ProductCard";
import { mockProductFromStore } from "@/lib/catalogUtils";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import WishlistHeart from "@/components/WishlistHeart";
import { cn } from "@/lib/utils";

interface ProductDetailsProps {
  product: StoreProduct;
}

const ProductDetails = ({ product }: ProductDetailsProps) => {
  const [qty, setQty] = useState(1);
  const { addItem, setIsOpen } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const wished = isInWishlist(product.id);
  const related = getRelatedProducts(product);
  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const handleAddToCart = () => {
    addItem(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        originalPrice: product.originalPrice,
      },
      qty,
    );
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setIsOpen(true);
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: product.name, url });
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    }
  };

  const handleWishlist = () => {
    toggleWishlist({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
  };

  return (
    <div>
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 mb-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ProductGallery images={product.images} name={product.name} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col"
        >
          <div className="flex items-start justify-between gap-4 mb-2">
            <span className="text-xs uppercase tracking-[0.3em] text-[#7E1E1E]/50 font-body">
              {product.category}
            </span>
            <WishlistHeart isWished={wished} onClick={handleWishlist} size="md" buttonClassName="p-3" />
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#7E1E1E] italic leading-tight mb-4">
            {product.name}
          </h1>

          <div className="flex items-center gap-1 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-4 h-4",
                  i < Math.floor(product.rating)
                    ? "fill-amber-500 text-amber-500"
                    : "text-[#7E1E1E]/15",
                )}
              />
            ))}
            <span className="text-sm text-[#7E1E1E]/60 font-body ml-2">
              {product.rating} · {product.reviewCount} reviews
            </span>
          </div>

          <div className="flex flex-wrap items-baseline gap-3 mb-6">
            <span className="font-display text-3xl font-bold text-[#7E1E1E]">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {product.originalPrice && (
              <span className="text-lg text-[#7E1E1E]/40 line-through font-body">
                ₹{product.originalPrice.toLocaleString("en-IN")}
              </span>
            )}
            {discount && (
              <span className="text-xs bg-[#7E1E1E] text-white px-2 py-1 rounded-full font-bold">
                {discount}% OFF
              </span>
            )}
          </div>

          <p
            className={cn(
              "inline-flex text-xs font-body font-medium px-3 py-1 rounded-full mb-6 w-fit",
              product.inStock
                ? "bg-emerald-50 text-emerald-800"
                : "bg-red-50 text-red-700",
            )}
          >
            {product.inStock ? "In Stock — Ready to ship" : "Made to order"}
          </p>

          <p className="text-[#4A2511]/75 font-body leading-relaxed mb-8">{product.description}</p>

          <ul className="space-y-2 mb-8">
            {product.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm font-body text-[#4A2511]/70">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7E1E1E]" />
                {f}
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-body text-[#7E1E1E]/60">Quantity</span>
            <div className="flex items-center border border-[#7E1E1E]/15 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center hover:bg-[#7E1E1E]/5"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center font-body font-semibold">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((q) => q + 1)}
                className="w-10 h-10 flex items-center justify-center hover:bg-[#7E1E1E]/5"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl border-2 border-[#7E1E1E] text-[#7E1E1E] font-body font-semibold text-sm hover:bg-[#7E1E1E]/5 transition-colors"
            >
              <ShoppingBag className="w-4 h-4" /> Add to Cart
            </button>
            <button
              type="button"
              onClick={handleBuyNow}
              className="flex-1 py-4 rounded-xl bg-[#7E1E1E] text-white font-body font-semibold text-sm hover:bg-[#6a1a1a] transition-colors"
            >
              Buy Now
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="sm:w-12 flex items-center justify-center py-4 rounded-xl border border-[#7E1E1E]/15 text-[#7E1E1E] hover:bg-[#7E1E1E]/5"
              aria-label="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 border-t border-[#7E1E1E]/10 pt-8">
            {[
              { icon: Truck, label: "Free delivery ₹5000+" },
              { icon: Shield, label: "Premium quality" },
              { icon: RotateCcw, label: "Easy returns" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center text-center gap-2">
                <Icon className="w-5 h-5 text-[#7E1E1E]/50" />
                <span className="text-[10px] font-body uppercase tracking-wider text-[#7E1E1E]/50">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {related.length > 0 && (
        <section>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#7E1E1E] italic mb-8">
            Related Products
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={mockProductFromStore(p)} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetails;
