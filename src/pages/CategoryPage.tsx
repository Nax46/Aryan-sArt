import { useParams, Link } from "react-router-dom";
import { products } from "@/lib/data";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnnouncementBar from "@/components/AnnouncementBar";
import MarqueeStrip from "@/components/MarqueeStrip";
import TrustStrip from "@/components/TrustStrip";
import WhatsAppButton from "@/components/WhatsAppButton";
import CartDrawer from "@/components/CartDrawer";
import WishlistDrawer from "@/components/WishlistDrawer";
import AuthModal from "@/components/AuthModal";
import { useScrollFadeIn } from "@/hooks/useScrollFadeIn";
import { ChevronRight } from "lucide-react";

const CategoryPage = () => {
  const { id } = useParams();
  const fadeIn = useScrollFadeIn();

  const categoryMap: Record<string, string> = {
    "lamps": "Lamps",
    "painting": "Painting",
    "decor": "Decor & Objects",
    "temples": "Temples"
  };

  const actualCategory = id ? categoryMap[id.toLowerCase()] || id : "";

  const filteredProducts = products.filter(
    (p) => p.category.toLowerCase() === actualCategory.toLowerCase()
  );

  const categoryName = actualCategory || (id ? id.charAt(0).toUpperCase() + id.slice(1) : "Collection");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AnnouncementBar />
      <Navbar />
      
      {/* Category Header */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-2 mb-8 text-[10px] font-body tracking-[0.2em] uppercase text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-medium">{categoryName}</span>
          </nav>

          <div className="text-center mb-16" ref={fadeIn}>
            <p className="text-xs font-body tracking-[0.3em] uppercase text-muted-foreground mb-3">Collection</p>
            <h1 className="text-4xl sm:text-5xl font-display font-light text-foreground mb-6">
              {categoryName}
            </h1>
            <div className="w-20 h-px bg-primary/30 mx-auto" />
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-32 border border-dashed border-border rounded-sm">
              <p className="text-muted-foreground font-body italic mb-6">No products found in this category yet.</p>
              <Link to="/" className="text-primary border-b border-primary pb-1 font-body text-xs uppercase tracking-widest hover:opacity-70 transition-opacity">
                Go back to Home
              </Link>
            </div>
          )}
        </div>
      </section>

      <MarqueeStrip />
      <TrustStrip />
      <Footer />
      
      <CartDrawer />
      <WishlistDrawer />
      <AuthModal />
      {/*<WhatsAppButton />*/}
    </div>
  );
};

export default CategoryPage;
