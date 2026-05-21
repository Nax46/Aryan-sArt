import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart, type CartItem as CartItemType } from "@/context/CartContext";
interface CartItemProps {
  item: CartItemType;
  compact?: boolean;
}

const CartItemRow = ({ item, compact }: CartItemProps) => {
  const { updateQty, removeItem } = useCart();

  const handleRemove = () => removeItem(item.id);

  return (
    <div
      className={`flex gap-4 ${compact ? "p-3" : "p-4 sm:p-5"} rounded-2xl border border-[#7E1E1E]/10 bg-white`}
    >
      <div className={`${compact ? "w-16 h-20" : "w-24 h-28"} rounded-xl overflow-hidden bg-[#F3EDE8] shrink-0`}>
        {item.image ? (
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-[#7E1E1E]/10" />
        )}
      </div>
      <div className="flex-1 min-w-0 flex flex-col">
        <h3 className={`font-body font-semibold text-[#4A2511] ${compact ? "text-sm" : "text-base"} line-clamp-2`}>
          {item.name}
        </h3>
        <p className="font-display text-lg font-bold text-[#7E1E1E] mt-1">
          ₹{(item.price * item.qty).toLocaleString("en-IN")}
        </p>
        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <div className="flex items-center border border-[#7E1E1E]/15 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => updateQty(item.id, item.qty - 1)}
              className="w-8 h-8 flex items-center justify-center text-[#7E1E1E] hover:bg-[#7E1E1E]/5"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center text-sm font-body font-medium">{item.qty}</span>
            <button
              type="button"
              onClick={() => updateQty(item.id, item.qty + 1)}
              className="w-8 h-8 flex items-center justify-center text-[#7E1E1E] hover:bg-[#7E1E1E]/5"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="p-2 text-[#7E1E1E]/50 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            aria-label="Remove"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItemRow;
