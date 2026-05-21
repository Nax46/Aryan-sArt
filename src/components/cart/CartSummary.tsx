import { useState } from "react";
import { Tag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CartSummaryProps {
  showCheckout?: boolean;
  onCheckout?: () => void;
  className?: string;
}

const CartSummary = ({ showCheckout = true, onCheckout, className }: CartSummaryProps) => {
  const {
    subtotal,
    shipping,
    tax,
    promoCode,
    setPromoCode,
    applyPromo,
    promoDiscount,
    grandTotal,
    items,
  } = useCart();
  const [promoInput, setPromoInput] = useState(promoCode);

  if (items.length === 0) return null;

  const handlePromo = () => {
    const ok = applyPromo(promoInput);
    if (ok) toast.success("Promo code applied!");
    else toast.error("Invalid promo code", { description: "Try WOOD10, ONCANVAS15, or CRAFT20" });
  };

  return (
    <div
      className={cn(
        "rounded-2xl border border-[#7E1E1E]/12 bg-gradient-to-br from-[#FFFCFA] to-[#F3EDE8] p-6 shadow-[0_16px_48px_rgba(62,24,24,0.08)]",
        className,
      )}
    >
      <h3 className="font-display text-xl font-bold text-[#7E1E1E] italic mb-5">Order Summary</h3>

      <div className="space-y-3 text-sm font-body mb-5">
        <div className="flex justify-between text-[#4A2511]/80">
          <span>Subtotal</span>
          <span>₹{subtotal.toLocaleString("en-IN")}</span>
        </div>
        <div className="flex justify-between text-[#4A2511]/80">
          <span>Shipping estimate</span>
          <span>{shipping === 0 ? "Free" : `₹${shipping.toLocaleString("en-IN")}`}</span>
        </div>
        <div className="flex justify-between text-[#4A2511]/80">
          <span>Estimated tax (5%)</span>
          <span>₹{tax.toLocaleString("en-IN")}</span>
        </div>
        {promoDiscount > 0 && (
          <div className="flex justify-between text-emerald-700">
            <span>Promo discount</span>
            <span>-₹{promoDiscount.toLocaleString("en-IN")}</span>
          </div>
        )}
        <div className="flex justify-between font-semibold text-[#7E1E1E] text-base pt-3 border-t border-[#7E1E1E]/10">
          <span>Grand total</span>
          <span>₹{grandTotal.toLocaleString("en-IN")}</span>
        </div>
      </div>

      <div className="flex gap-2 mb-5">
        <div className="relative flex-1">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7E1E1E]/40" />
          <input
            type="text"
            value={promoInput}
            onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
            placeholder="Promo code"
            className="w-full h-11 pl-10 pr-3 rounded-xl border border-[#7E1E1E]/15 bg-white text-sm font-body focus:outline-none focus:ring-2 focus:ring-[#7E1E1E]/20"
          />
        </div>
        <button
          type="button"
          onClick={handlePromo}
          className="px-4 h-11 rounded-xl border border-[#7E1E1E]/20 text-[#7E1E1E] font-body text-sm font-semibold hover:bg-[#7E1E1E]/5"
        >
          Apply
        </button>
      </div>

      {showCheckout && (
        <button
          type="button"
          onClick={onCheckout}
          className="w-full py-3.5 rounded-xl bg-[#7E1E1E] text-white font-body font-semibold text-sm hover:bg-[#6a1a1a] transition-colors shadow-[0_8px_24px_rgba(126,30,30,0.25)]"
        >
          Proceed to Checkout
        </button>
      )}
    </div>
  );
};

export default CartSummary;
