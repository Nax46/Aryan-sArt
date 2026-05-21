import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Product } from "@/lib/data";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import WishlistHeart from "@/components/WishlistHeart";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem: addToCart, setIsOpen: setCartOpen } = useCart();
  const { isInWishlist, openSelectModal, removeFromAllCollections } = useWishlist();
  const { isAuthenticated, setIsAuthModalOpen } = useAuth();
  const isWished = isInWishlist(product.id.toString());
  const navigate = useNavigate();

  const handleWishlistClick = () => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }
    if (isWished) {
      removeFromAllCollections(product.id.toString());
    } else {
      openSelectModal({
        productId: product.id.toString(),
        name: product.name,
        price: product.price,
        image: product.image,
      });
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }
    addToCart({
      id: String(product.id),
      name: product.name,
      price: product.price,
      image: product.image,
    });
    toast.success("Added to cart");
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }
    addToCart({
      id: String(product.id),
      name: product.name,
      price: product.price,
      image: product.image,
    });
    setCartOpen(true);
  };

  const handleNavigateToDetail = () => {
    window.scrollTo({ top: 0, behavior: "instant" });
    navigate(`/product/${product.id}`);
  };

  return (
    <div
      onClick={handleNavigateToDetail}
      className="group relative bg-white border border-border/40 hover:shadow-xl transition-all duration-500 rounded-sm p-3 cursor-pointer h-full flex flex-col"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-sm mb-4 bg-[#F9F7F5]">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center opacity-20"
            style={{ backgroundColor: product.color }}
          >
            <div className="w-20 h-20 rounded-full blur-2xl" style={{ backgroundColor: product.color }} />
          </div>
        )}

        <div className="absolute top-3 right-3 z-10">
          <WishlistHeart isWished={isWished} onClick={handleWishlistClick} size="sm" />
        </div>
      </div>

      <div className="flex-1 flex flex-col px-1">
        <p className="text-[10px] text-muted-foreground font-body uppercase tracking-[0.2em] mb-1">
          {product.category}
        </p>
        <h3 className="font-body text-sm font-medium text-foreground leading-tight mb-2 line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        <div className="mt-auto">
          <div className="flex items-center justify-between mb-4">
            <p className="font-body text-base font-semibold text-foreground">
              ₹{product.price.toLocaleString("en-IN")}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleAddToCart}
              className="flex-1 py-2 bg-primary/10 text-primary border border-primary text-[10px] font-bold uppercase tracking-wider rounded-sm hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center gap-1.5 font-display"
            >
              <ShoppingBag className="w-3 h-3" />
              Add
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 py-2 bg-secondary text-secondary-foreground text-[10px] font-bold uppercase tracking-wider rounded-sm hover:bg-secondary/90 transition-all font-display"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
