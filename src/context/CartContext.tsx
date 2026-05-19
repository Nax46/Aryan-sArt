import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useAuth } from "./AuthContext";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  qty: number;
  image?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "qty">) => void;
  removeItem: (id: number) => void;
  updateQty: (id: number, qty: number) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  total: number;
  count: number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);
const STORAGE_KEY = "canvas_cart";

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { user, setIsAuthModalOpen } = useAuth();

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch {
        /* ignore */
      }
    }
  }, []);

  const saveItems = useCallback((newItems: CartItem[]) => {
    setItems(newItems);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
  }, []);

  const addItem = useCallback(
    (item: Omit<CartItem, "qty">) => {
      if (!user) {
        setIsAuthModalOpen(true);
        return;
      }
      setItems((prev) => {
        const existing = prev.find((i) => i.id === item.id);
        const updated = existing
          ? prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i))
          : [...prev, { ...item, qty: 1 }];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
      setIsOpen(true);
    },
    [user, setIsAuthModalOpen]
  );

  const removeItem = useCallback(
    (id: number) => {
      setItems((prev) => {
        const updated = prev.filter((i) => i.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    },
    []
  );

  const updateQty = useCallback(
    (id: number, qty: number) => {
      if (qty < 1) {
        removeItem(id);
        return;
      }
      setItems((prev) => {
        const updated = prev.map((i) => (i.id === id ? { ...i, qty } : i));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    },
    [removeItem]
  );

  const clearCart = useCallback(() => {
    saveItems([]);
  }, [saveItems]);

  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQty, isOpen, setIsOpen, total, count, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
