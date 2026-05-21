import { useParams, Link } from "react-router-dom";
import FixedSiteHeader from "@/components/layout/FixedSiteHeader";
import HeaderSpacer from "@/components/layout/HeaderSpacer";
import Footer from "@/components/home/Footer";
import MarqueeStrip from "@/components/MarqueeStrip";
import TrustStrip from "@/components/TrustStrip";
import CartDrawer from "@/components/CartDrawer";
import WishlistDrawer from "@/components/WishlistDrawer";
import AuthModal from "@/components/AuthModal";
import QuickViewModal from "@/components/product/QuickViewModal";
import ProductDetails from "@/components/product/ProductDetails";
import { getProductById } from "@/lib/catalog";
import { usePageTitle } from "@/components/layout/usePageTitle";

const ProductPage = () => {
  const { id } = useParams();
  const product = id ? getProductById(id) : undefined;

  usePageTitle(product ? `${product.name} | OnCanvas` : "Product | OnCanvas");

  if (!product) {
    return (
      <div className="min-h-screen bg-background text-center px-4">
        <FixedSiteHeader />
        <HeaderSpacer />
        <div className="pt-8">
        <p className="font-display text-xl text-[#7E1E1E] mb-4">Product not found</p>
        <Link to="/" className="text-[#7E1E1E] font-body underline">
          Back to home
        </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <FixedSiteHeader />
      <HeaderSpacer />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <ProductDetails product={product} />
      </main>
      <MarqueeStrip />
      <TrustStrip />
      <Footer />
      <CartDrawer />
      <WishlistDrawer />
      <AuthModal />
      <QuickViewModal />
    </div>
  );
};

export default ProductPage;
