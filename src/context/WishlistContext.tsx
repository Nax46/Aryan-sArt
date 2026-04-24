import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image?: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  isInWishlist: (id: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
};

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("canvas_wishlist");
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse wishlist");
      }
    }
  }, []);

  const saveItems = (newItems: WishlistItem[]) => {
    setItems(newItems);
    localStorage.setItem("canvas_wishlist", JSON.stringify(newItems));
  };

  const addItem = (item: WishlistItem) => {
    if (!items.find((i) => i.id === item.id)) {
      saveItems([...items, item]);
      toast.success("Added to wishlist!");
    } else {
      toast.info("Item is already in wishlist");
    }
  };

  const removeItem = (id: string) => {
    saveItems(items.filter((i) => i.id !== id));
    toast.success("Removed from wishlist");
  };

  const isInWishlist = (id: string) => {
    return items.some((i) => i.id === id);
  };

  return (
    <WishlistContext.Provider value={{ items, isOpen, setIsOpen, addItem, removeItem, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
