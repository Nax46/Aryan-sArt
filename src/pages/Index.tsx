import FixedSiteHeader from "@/components/layout/FixedSiteHeader";
import HeaderSpacer from "@/components/layout/HeaderSpacer";
import Hero from "@/components/home/Hero";
import CategoryCards from "@/components/home/CategoryCards";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Trending from "@/components/home/Trending";
import NewArrivals from "@/components/home/NewArrivals";
import BestSellers from "@/components/home/BestSellers";
import PersonalizedBanner from "@/components/home/PersonalizedBanner";
import Testimonials from "@/components/home/Testimonials";
import Newsletter from "@/components/home/Newsletter";
import HomeFooter from "@/components/home/Footer";
import CustomOrderForm from "@/components/CustomOrderForm";
import CartDrawer from "@/components/CartDrawer";
import WishlistDrawer from "@/components/WishlistDrawer";
import AuthModal from "@/components/AuthModal";
import QuickViewModal from "@/components/product/QuickViewModal";

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <FixedSiteHeader />
      <HeaderSpacer />
      <Hero />
      <CategoryCards />
      <FeaturedProducts />
      <Trending />
      <NewArrivals />
      <BestSellers />
      <PersonalizedBanner />
      <Testimonials />
      <Newsletter />
      <CustomOrderForm />
      <HomeFooter />
      <CartDrawer />
      <WishlistDrawer />
      <AuthModal />
      <QuickViewModal />
    </div>
  );
};

export default Index;
