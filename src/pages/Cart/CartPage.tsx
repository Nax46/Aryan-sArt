import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import PageLayout from "@/components/layout/PageLayout";
import { getPageMeta } from "@/config/pageRegistry";
import CartItemRow from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const meta = getPageMeta("/cart");

const CartPage = () => {
  const { items } = useCart();
  const { setIsAuthModalOpen } = useAuth();

  const handleCheckout = () => {
    toast.info("Checkout opens from cart drawer when logged in with delivery address.");
    setIsAuthModalOpen(true);
  };

  if (items.length === 0) {
    return (
      <PageLayout meta={meta}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="w-24 h-24 rounded-3xl bg-[#7E1E1E]/8 flex items-center justify-center mb-6">
            <ShoppingBag className="w-12 h-12 text-[#7E1E1E]/40" />
          </div>
          <h2 className="font-display text-2xl font-bold text-[#7E1E1E] italic mb-2">Your cart is empty</h2>
          <p className="text-sm text-[#4A2511]/60 font-body mb-8 max-w-sm">
            Discover handcrafted wooden art and bring warmth to your space.
          </p>
          <Link
            to="/home/featured-products"
            className="px-8 py-3 rounded-xl bg-[#7E1E1E] text-white font-body font-semibold text-sm hover:bg-[#6a1a1a]"
          >
            Continue Shopping
          </Link>
        </motion.div>
      </PageLayout>
    );
  }

  return (
    <PageLayout meta={meta}>
      <div className="grid lg:grid-cols-3 gap-8 lg:gap-10">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <CartItemRow key={item.id} item={item} />
          ))}
        </div>
        <div className="lg:col-span-1">
          <div className="sticky top-28">
            <CartSummary onCheckout={handleCheckout} />
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default CartPage;
