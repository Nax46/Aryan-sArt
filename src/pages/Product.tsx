import { useParams, useNavigate } from "react-router-dom";
import { products } from "@/lib/data";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnnouncementBar from "@/components/AnnouncementBar";
import MarqueeStrip from "@/components/MarqueeStrip";
import TrustStrip from "@/components/TrustStrip";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Heart, ShoppingBag, Truck, Shield, RotateCcw } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import CartDrawer from "@/components/CartDrawer";
import WishlistDrawer from "@/components/WishlistDrawer";
import AuthModal from "@/components/AuthModal";
import { toast } from "sonner";

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find(p => p.id === Number(id));
  const { addItem: addToCart, setIsOpen: setCartOpen } = useCart();
  const { isInWishlist, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlist();
  const { user, setIsAuthModalOpen } = useAuth();

  if (!product) {
    return <div className="min-h-screen bg-background pt-32 text-center">Product not found</div>;
  }

  const isWished = isInWishlist(product.id.toString());

  const handleToggleWishlist = () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    if (isWished) {
      removeFromWishlist(product.id.toString());
    } else {
      addToWishlist({ 
        id: product.id.toString(), 
        name: product.name, 
        price: product.price, 
        image: product.image 
      });
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    addToCart({ 
      id: product.id, 
      name: product.name, 
      price: product.price,
      image: product.image
    });
    setCartOpen(true);
    toast.success("Added to cart");
  };

  const handleBuyNow = () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    addToCart({ 
      id: product.id, 
      name: product.name, 
      price: product.price,
      image: product.image
    });
    setCartOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex flex-col md:flex-row gap-12 lg:gap-20">
          {/* Image Gallery */}
          <div className="w-full md:w-1/2 flex flex-col gap-4">
            <div className="relative aspect-[4/5] rounded-sm overflow-hidden border border-border bg-card">
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
          </div>

          {/* Product Info */}
          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <div className="mb-4">
              <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-body">{product.category}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-light text-foreground mb-6 leading-tight">{product.name}</h1>
            
            <div className="flex items-baseline gap-4 mb-8">
              <span className="text-3xl font-display font-semibold text-foreground">₹{product.price.toLocaleString("en-IN")}</span>
              <span className="text-lg text-muted-foreground line-through">₹{(product.price * 1.2).toLocaleString("en-IN")}</span>
              <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-sm font-medium">20% OFF</span>
            </div>

            <p className="text-muted-foreground font-body text-base leading-relaxed mb-10 max-w-lg">
              {product.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button 
                onClick={handleAddToCart}
                className="flex-1 py-4 bg-primary/10 text-primary border border-primary font-display text-[10px] font-bold tracking-[0.2em] uppercase rounded-sm hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Cart
              </button>
              <button 
                onClick={handleBuyNow}
                className="flex-1 py-4 bg-secondary text-secondary-foreground font-display text-[10px] font-bold tracking-[0.2em] uppercase rounded-sm hover:bg-secondary/90 transition-all shadow-sm"
              >
                Buy Now
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-b border-border py-8 mb-8">
              <div className="flex flex-col items-center text-center gap-2">
                <Truck className="w-6 h-6 text-primary/60" />
                <span className="text-[10px] font-body font-medium uppercase tracking-widest text-muted-foreground">Free Delivery</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <Shield className="w-6 h-6 text-primary/60" />
                <span className="text-[10px] font-body font-medium uppercase tracking-widest text-muted-foreground">Premium Quality</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <RotateCcw className="w-6 h-6 text-primary/60" />
                <span className="text-[10px] font-body font-medium uppercase tracking-widest text-muted-foreground">Secure Payments</span>
              </div>
            </div>

          </div>
        </div>
      </main>

      <MarqueeStrip />
      <TrustStrip />
      <Footer />
      
      <CartDrawer />
      <WishlistDrawer />
      <AuthModal />
      <WhatsAppButton />
    </div>
  );
};

export default ProductPage;
