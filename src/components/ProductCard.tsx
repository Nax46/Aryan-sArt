import { Heart, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Product } from "@/lib/data";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem: addToCart, setIsOpen: setCartOpen } = useCart();
  const { isInWishlist, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlist();
  const isWished = isInWishlist(product.id.toString());
  const navigate = useNavigate();

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isWished) {
      removeFromWishlist(product.id.toString());
    } else {
      addToWishlist({ id: product.id.toString(), name: product.name, price: product.price, image: product.image });
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({ id: product.id.toString(), name: product.name, price: product.price });
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({ id: product.id.toString(), name: product.name, price: product.price });
    setCartOpen(true);
  };

  return (
    <div 
      onClick={() => { window.scrollTo({ top: 0, behavior: 'instant' }); navigate(`/product/${product.id}`); }}
      className="group relative bg-card/50 border border-border hover:shadow-lg transition-all duration-300 rounded-sm p-3 cursor-pointer h-full flex flex-col"
    >
      <div className="relative aspect-[3/4] overflow-hidden mb-3">
        {product.image ? (
          <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="absolute inset-0 bg-muted flex items-center justify-center">
            <div className="w-16 h-16 rounded-full" style={{ backgroundColor: product.color, opacity: 0.5 }} />
          </div>
        )}
        <button
          onClick={handleWishlistClick}
          className="absolute top-2 right-2 p-1.5 bg-background/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-background transition-colors z-10"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${isWished ? "fill-primary text-primary" : "text-muted-foreground hover:text-primary"}`}
          />
        </button>
      </div>
      <p className="text-[11px] text-muted-foreground font-body uppercase tracking-wider mb-1 truncate">
        {product.category}
      </p>
      <h3 className="font-body text-sm font-medium text-foreground truncate mb-1 group-hover:text-primary transition-colors">
        {product.name}
      </h3>
      <div className="flex items-center gap-2 mb-3">
        <p className="font-body text-base font-semibold text-foreground">
          ₹{product.price.toLocaleString("en-IN")}
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2 mt-auto relative z-10">
        <button
          onClick={handleAddToCart}
          className="flex-1 py-2 bg-primary/10 text-primary border border-primary text-xs font-medium uppercase rounded-sm shadow-sm hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center gap-1.5 font-display"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          Add
        </button>
        <button
          onClick={handleBuyNow}
          className="flex-1 py-2 bg-secondary text-secondary-foreground text-xs font-medium uppercase rounded-sm shadow-sm hover:bg-secondary/90 transition-all flex items-center justify-center font-display"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
