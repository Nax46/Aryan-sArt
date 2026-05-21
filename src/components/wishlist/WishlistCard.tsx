import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import type { WishlistItem } from "@/context/WishlistContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
interface WishlistCardProps {
  item: WishlistItem;
}

const WishlistCard = ({ item }: WishlistCardProps) => {
  const { removeFromAllCollections } = useWishlist();
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      id: item.productId,
      name: item.name,
      price: item.price,
      image: item.image,
    });
  };

  return (
    <div className="group flex flex-col sm:flex-row gap-4 p-4 sm:p-5 rounded-2xl border border-[#7E1E1E]/10 bg-white shadow-[0_8px_30px_rgba(62,24,24,0.06)] hover:shadow-[0_16px_40px_rgba(62,24,24,0.1)] transition-all duration-300">
      <Link
        to={`/product/${item.productId}`}
        className="w-full sm:w-36 aspect-[4/5] sm:aspect-square rounded-xl overflow-hidden bg-[#F3EDE8] shrink-0"
      >
        {item.image ? (
          <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Heart className="w-8 h-8 text-[#7E1E1E]/20" />
          </div>
        )}
      </Link>
      <div className="flex-1 flex flex-col min-w-0">
        <Link to={`/product/${item.productId}`}>
          <h3 className="font-body text-base sm:text-lg font-semibold text-[#4A2511] hover:text-[#7E1E1E] transition-colors line-clamp-2">
            {item.name}
          </h3>
        </Link>
        <p className="font-display text-xl font-bold text-[#7E1E1E] mt-2">
          ₹{item.price.toLocaleString("en-IN")}
        </p>
        <div className="mt-auto flex flex-wrap gap-2 pt-4">
          <button
            type="button"
            onClick={handleAddToCart}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#7E1E1E] text-white text-sm font-semibold font-body hover:bg-[#6a1a1a] transition-colors"
          >
            <ShoppingBag className="w-4 h-4" /> Add to Cart
          </button>
          <button
            type="button"
            onClick={() => removeFromAllCollections(item.productId)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#7E1E1E]/15 text-[#7E1E1E]/70 text-sm font-body hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default WishlistCard;
