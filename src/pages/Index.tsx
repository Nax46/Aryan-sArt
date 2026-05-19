import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MarqueeStrip from "@/components/MarqueeStrip";
import NewArrivals from "@/components/NewArrivals";
import Philosophy from "@/components/Philosophy";
import ShopByCategory from "@/components/ShopByCategory";
import TrustStrip from "@/components/TrustStrip";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import WhatsAppButton from "@/components/WhatsAppButton";
import CustomOrderForm from "@/components/CustomOrderForm";
import AuthModal from "@/components/AuthModal";
import WishlistDrawer from "@/components/WishlistDrawer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <Navbar />
      <Hero />
      <MarqueeStrip />
      <NewArrivals />
      <Philosophy />
      <ShopByCategory />
      <TrustStrip />
      <CustomOrderForm />
      <Footer />
      <CartDrawer />
      <WishlistDrawer />
      {/*<WhatsAppButton />*/}
      <AuthModal />
    </div>
  );
};

export default Index;
