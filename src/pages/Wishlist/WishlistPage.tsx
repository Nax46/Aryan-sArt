import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import PageLayout from "@/components/layout/PageLayout";
import { getPageMeta } from "@/config/pageRegistry";
import WishlistCard from "@/components/wishlist/WishlistCard";
import { useWishlist } from "@/context/WishlistContext";

const meta = getPageMeta("/wishlist");

const WishlistPage = () => {
  const { items } = useWishlist();

  if (items.length === 0) {
    return (
      <PageLayout meta={meta}>
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-24 text-center rounded-3xl border border-dashed border-[#7E1E1E]/15 bg-gradient-to-br from-[#FFFCFA] to-[#F3EDE8]"
        >
          <div className="w-28 h-28 rounded-full bg-[#7E1E1E]/8 flex items-center justify-center mb-6">
            <Heart className="w-14 h-14 text-[#7E1E1E]/25" />
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#7E1E1E] italic mb-3">
            Your wishlist is waiting for something beautiful.
          </h2>
          <p className="text-sm text-[#4A2511]/55 font-body mb-8 max-w-md">
            Save pieces you love and return anytime — crafted wood, designed with emotion.
          </p>
          <Link
            to="/"
            className="px-8 py-3 rounded-xl bg-[#7E1E1E] text-white font-body font-semibold text-sm hover:bg-[#6a1a1a]"
          >
            Explore Collection
          </Link>
        </motion.div>
      </PageLayout>
    );
  }

  return (
    <PageLayout meta={meta}>
      <p className="text-sm font-body text-[#7E1E1E]/50 mb-6">{items.length} saved items</p>
      <div className="space-y-4 sm:space-y-5">
        {items.map((item, i) => (
          <motion.div
            key={item.productId}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <WishlistCard item={item} />
          </motion.div>
        ))}
      </div>
    </PageLayout>
  );
};

export default WishlistPage;
