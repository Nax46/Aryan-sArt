import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from "react";
import { toast } from "sonner";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  image?: string;
  originalPrice?: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  subtotal: number;
  shipping: number;
  tax: number;
  promoCode: string;
  promoDiscount: number;
  setPromoCode: (code: string) => void;
  applyPromo: (code?: string) => boolean;
  grandTotal: number;
  /** @deprecated use subtotal — kept for CartDrawer compatibility */
  total: number;
  count: number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);
const CART_STORAGE_KEY = "oncanvas_cart";

const PROMO_CODES: Record<string, number> = {
  WOOD10: 0.1,
  ONCANVAS15: 0.15,
  CRAFT20: 0.2,
};

const loadCart = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveCart = (items: CartItem[]) => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0);

  useEffect(() => {
    setItems(loadCart());
  }, []);

  const persist = useCallback((next: CartItem[]) => {
    setItems(next);
    saveCart(next);
  }, []);

  const setIsOpenSafe = useCallback((open: boolean) => setIsOpen(open), []);

  const addItem = useCallback(
    (item: Omit<CartItem, "qty">, qty = 1) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.id === item.id);
        const updated = existing
          ? prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty + qty } : i))
          : [...prev, { ...item, qty }];
        saveCart(updated);
        toast.success("Added to cart");
        return updated;
      });
      setIsOpen(true);
    },
    [],
  );

  const removeItem = useCallback(
    (id: string) => {
      setItems((prev) => {
        const updated = prev.filter((i) => i.id !== id);
        saveCart(updated);
        toast.success("Removed from cart");
        return updated;
      });
    },
    [],
  );

  const updateQty = useCallback(
    (id: string, qty: number) => {
      if (qty < 1) {
        removeItem(id);
        return;
      }
      setItems((prev) => {
        const updated = prev.map((i) => (i.id === id ? { ...i, qty } : i));
        saveCart(updated);
        return updated;
      });
    },
    [removeItem],
  );

  const clearCart = useCallback(() => {
    persist([]);
    setPromoDiscount(0);
    setPromoCode("");
  }, [persist]);

  const subtotal = useMemo(() => items.reduce((s, i) => s + i.price * i.qty, 0), [items]);
  const shipping = useMemo(() => (subtotal === 0 ? 0 : subtotal >= 5000 ? 0 : 199), [subtotal]);
  const tax = useMemo(() => Math.round(subtotal * 0.05), [subtotal]);
  const count = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items]);
  const grandTotal = useMemo(
    () => Math.max(0, subtotal + shipping + tax - promoDiscount),
    [subtotal, shipping, tax, promoDiscount],
  );

  const applyPromo = useCallback(
    (code?: string) => {
      const normalized = (code ?? promoCode).trim().toUpperCase();
      if (code) setPromoCode(normalized);
      const rate = PROMO_CODES[normalized];
      if (!rate) return false;
      setPromoDiscount(Math.round(subtotal * rate));
      return true;
    },
    [promoCode, subtotal],
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQty,
        isOpen,
        setIsOpen: setIsOpenSafe,
        subtotal,
        shipping,
        tax,
        promoCode,
        promoDiscount,
        setPromoCode,
        applyPromo,
        grandTotal,
        total: subtotal,
        count,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
