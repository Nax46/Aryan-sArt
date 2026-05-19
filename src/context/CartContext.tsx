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
const LEGACY_STORAGE_KEY = "canvas_cart";

const getCartStorageKey = (userId: string) => `canvas_cart_${userId}`;

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpenRaw] = useState(false);
  const { user, isAuthenticated, setIsAuthModalOpen } = useAuth();

  const persistItems = useCallback(
    (newItems: CartItem[]) => {
      setItems(newItems);
      if (user?.id) {
        localStorage.setItem(getCartStorageKey(user.id), JSON.stringify(newItems));
      }
    },
    [user?.id]
  );

  const clearCart = useCallback(() => {
    setItems([]);
    if (user?.id) {
      localStorage.removeItem(getCartStorageKey(user.id));
    }
  }, [user?.id]);

  // Load cart only for logged-in user; clear when logged out
  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      setItems([]);
      setIsOpenRaw(false);
      return;
    }

    const stored = localStorage.getItem(getCartStorageKey(user.id));
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch {
        setItems([]);
      }
    } else {
      setItems([]);
    }

    localStorage.removeItem(LEGACY_STORAGE_KEY);
  }, [isAuthenticated, user?.id]);

  const setIsOpen = useCallback(
    (open: boolean) => {
      if (open && !isAuthenticated) {
        setIsAuthModalOpen(true);
        return;
      }
      setIsOpenRaw(open);
    },
    [isAuthenticated, setIsAuthModalOpen]
  );

  const addItem = useCallback(
    (item: Omit<CartItem, "qty">) => {
      if (!isAuthenticated || !user) {
        setIsAuthModalOpen(true);
        return;
      }
      setItems((prev) => {
        const existing = prev.find((i) => i.id === item.id);
        const updated = existing
          ? prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i))
          : [...prev, { ...item, qty: 1 }];
        localStorage.setItem(getCartStorageKey(user.id), JSON.stringify(updated));
        return updated;
      });
      setIsOpenRaw(true);
    },
    [isAuthenticated, user, setIsAuthModalOpen]
  );

  const removeItem = useCallback(
    (id: number) => {
      if (!isAuthenticated || !user) return;
      setItems((prev) => {
        const updated = prev.filter((i) => i.id !== id);
        localStorage.setItem(getCartStorageKey(user.id), JSON.stringify(updated));
        return updated;
      });
    },
    [isAuthenticated, user]
  );

  const updateQty = useCallback(
    (id: number, qty: number) => {
      if (!isAuthenticated || !user) return;
      if (qty < 1) {
        removeItem(id);
        return;
      }
      setItems((prev) => {
        const updated = prev.map((i) => (i.id === id ? { ...i, qty } : i));
        localStorage.setItem(getCartStorageKey(user.id), JSON.stringify(updated));
        return updated;
      });
    },
    [isAuthenticated, user, removeItem]
  );

  const total = isAuthenticated ? items.reduce((s, i) => s + i.price * i.qty, 0) : 0;
  const count = isAuthenticated ? items.reduce((s, i) => s + i.qty, 0) : 0;

  return (
    <CartContext.Provider
      value={{
        items: isAuthenticated ? items : [],
        addItem,
        removeItem,
        updateQty,
        isOpen,
        setIsOpen,
        total,
        count,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
