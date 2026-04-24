import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useAuth } from "./AuthContext";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  qty: number;
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
  wishlist: number[];
  toggleWishlist: (id: number) => void;
}

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [wishlist, setWishlist] = useState<number[]>([]);

  const { user, setIsAuthModalOpen } = useAuth();

  const addItem = useCallback((item: Omit<CartItem, "qty">) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) return prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, { ...item, qty: 1 }];
    });
    setIsOpen(true);
  }, [user, setIsAuthModalOpen]);

  const removeItem = useCallback((id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQty = useCallback((id: number, qty: number) => {
    if (qty < 1) return;
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)));
  }, []);

  const toggleWishlist = useCallback((id: number) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    setWishlist((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  }, [user, setIsAuthModalOpen]);

  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, isOpen, setIsOpen, total, count, wishlist, toggleWishlist }}>
      {children}
    </CartContext.Provider>
  );
};
