import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import FixedSiteHeader from "@/components/layout/FixedSiteHeader";
import HeaderSpacer from "@/components/layout/HeaderSpacer";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import WishlistDrawer from "@/components/WishlistDrawer";
import AuthModal from "@/components/AuthModal";
import PageTransition from "./PageTransition";
import RouteLoadingBar from "./RouteLoadingBar";

const SiteLayout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-x-hidden max-w-[100vw]">
      <RouteLoadingBar />
      <FixedSiteHeader />
      <HeaderSpacer />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
          <AnimatePresence mode="wait">
            <PageTransition key={location.pathname}>
              <Outlet />
            </PageTransition>
          </AnimatePresence>
        </div>
      </main>
      <Footer />
      <CartDrawer />
      <WishlistDrawer />
      <AuthModal />
    </div>
  );
};

export default SiteLayout;
