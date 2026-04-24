import { useParams, useNavigate } from "react-router-dom";
import { products } from "@/lib/data";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Heart, ShoppingBag, Truck, Shield, RotateCcw } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import CartDrawer from "@/components/CartDrawer";
import WishlistDrawer from "@/components/WishlistDrawer";
import AuthModal from "@/components/AuthModal";

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find(p => p.id === Number(id));
  const { addItem: addToCart, setIsOpen: setCartOpen } = useCart();
  const { isInWishlist, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlist();

  if (!product) {
    return <div className="min-h-screen bg-background pt-32 text-center">Product not found</div>;
  }

  const isWished = isInWishlist(product.id.toString());

  const handleToggleWishlist = () => {
    if (isWished) {
      removeFromWishlist(product.id.toString());
    } else {
      addToWishlist({ id: product.id.toString(), name: product.name, price: product.price, image: product.image });
    }
  };

  const handleAddToCart = () => {
    addToCart({ id: product.id.toString(), name: product.name, price: product.price });
    setCartOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Image Gallery */}
          <div className="w-full md:w-1/2 flex flex-col gap-4">
            <div className="relative aspect-square rounded-sm overflow-hidden border border-border bg-card">
              {product.image ? (
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: product.color, opacity: 0.5 }} />
              )}
              <button 
                onClick={handleToggleWishlist}
                className="absolute top-4 right-4 p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
              >
                <Heart className={`w-5 h-5 ${isWished ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
              </button>
            </div>
            {/* Thumbnails could go here */}
          </div>

          {/* Product Info */}
          <div className="w-full md:w-1/2 flex flex-col">
            <div className="mb-2">
              <span className="text-sm uppercase tracking-wider text-muted-foreground font-body">{product.category}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-medium text-foreground mb-4">{product.name}</h1>
            
            <div className="flex items-end gap-4 mb-6">
              <span className="text-3xl font-display font-semibold text-foreground">₹{product.price.toLocaleString("en-IN")}</span>
              <span className="text-lg text-primary font-medium line-through mb-1">₹{(product.price * 1.2).toLocaleString("en-IN")}</span>
              <span className="text-sm text-secondary font-medium mb-1.5">(20% OFF)</span>
            </div>

            <p className="text-muted-foreground font-body leading-relaxed mb-8">
              {product.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <button 
                onClick={handleAddToCart}
                className="flex-1 py-4 bg-primary/10 text-primary border border-primary font-body text-sm font-medium tracking-wider uppercase rounded-sm hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Cart
              </button>
              <button 
                onClick={() => {
                  addToCart({ id: product.id.toString(), name: product.name, price: product.price });
                  setCartOpen(true);
                  // navigate('/checkout'); // Later when we have dedicated checkout route, or just trigger payment in cart
                }}
                className="flex-1 py-4 bg-secondary text-secondary-foreground font-body text-sm font-medium tracking-wider uppercase rounded-sm hover:bg-secondary/90 transition-all shadow-sm"
              >
                Buy Now
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-b border-border py-6 mb-8">
              <div className="flex flex-col items-center text-center gap-2">
                <Truck className="w-6 h-6 text-primary" />
                <span className="text-xs font-body font-medium text-foreground">Free Delivery</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <Shield className="w-6 h-6 text-primary" />
                <span className="text-xs font-body font-medium text-foreground">1 Year Warranty</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <RotateCcw className="w-6 h-6 text-primary" />
                <span className="text-xs font-body font-medium text-foreground">7 Days Replacement</span>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
      <CartDrawer />
      <WishlistDrawer />
      <AuthModal />
    </div>
  );
};

export default ProductPage;
