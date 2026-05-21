import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";

export interface WishlistItem {
  productId: string;
  name: string;
  price: number;
  image?: string;
  addedAt?: string;
}

export interface WishlistCollection {
  _id: string;
  name: string;
  isDefault: boolean;
  items: WishlistItem[];
}

export interface PendingWishlistItem {
  productId: string;
  name: string;
  price: number;
  image?: string;
}

interface WishlistContextType {
  collections: WishlistCollection[];
  items: WishlistItem[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  activeCollectionId: string | null;
  setActiveCollectionId: (id: string | null) => void;
  isLoading: boolean;
  totalItemCount: number;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (item: PendingWishlistItem) => void;
  getCollectionsForProduct: (productId: string) => WishlistCollection[];
  openSelectModal: (item: PendingWishlistItem) => void;
  closeSelectModal: () => void;
  selectModalOpen: boolean;
  pendingItem: PendingWishlistItem | null;
  addToCollections: (collectionIds: string[], item: PendingWishlistItem, newListName?: string) => Promise<void>;
  removeFromAllCollections: (productId: string) => void;
  removeFromCollection: (collectionId: string, productId: string) => void;
  createCollection: (name: string) => Promise<WishlistCollection | null>;
  deleteCollection: (collectionId: string) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | null>(null);
const STORAGE_KEY = "oncanvas_wishlist";
const DEFAULT_COLLECTION_ID = "my-list";

const loadItems = (): WishlistItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveItems = (items: WishlistItem[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

const itemsToCollections = (items: WishlistItem[]): WishlistCollection[] => [
  { _id: DEFAULT_COLLECTION_ID, name: "My List", isDefault: true, items },
];

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
};

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeCollectionId, setActiveCollectionId] = useState<string | null>(DEFAULT_COLLECTION_ID);
  const [selectModalOpen, setSelectModalOpen] = useState(false);
  const [pendingItem, setPendingItem] = useState<PendingWishlistItem | null>(null);

  useEffect(() => {
    setItems(loadItems());
  }, []);

  const persist = useCallback((next: WishlistItem[]) => {
    setItems(next);
    saveItems(next);
  }, []);

  const collections = useMemo(() => itemsToCollections(items), [items]);

  const isInWishlist = useCallback(
    (productId: string) => items.some((i) => i.productId === productId),
    [items],
  );

  const toggleWishlist = useCallback(
    (item: PendingWishlistItem) => {
      if (isInWishlist(item.productId)) {
        const next = items.filter((i) => i.productId !== item.productId);
        persist(next);
        toast.success("Removed from wishlist");
      } else {
        const next = [
          ...items,
          { ...item, addedAt: new Date().toISOString() },
        ];
        persist(next);
        toast.success("Added to wishlist");
      }
    },
    [items, isInWishlist, persist],
  );

  const removeFromAllCollections = useCallback(
    (productId: string) => {
      const next = items.filter((i) => i.productId !== productId);
      persist(next);
      toast.success("Removed from wishlist");
    },
    [items, persist],
  );

  const removeFromCollection = useCallback(
    (_collectionId: string, productId: string) => {
      removeFromAllCollections(productId);
    },
    [removeFromAllCollections],
  );

  const openSelectModal = useCallback((item: PendingWishlistItem) => {
    toggleWishlist(item);
  }, [toggleWishlist]);

  const closeSelectModal = useCallback(() => {
    setSelectModalOpen(false);
    setPendingItem(null);
  }, []);

  const addToCollections = useCallback(
    async (_collectionIds: string[], item: PendingWishlistItem) => {
      if (!isInWishlist(item.productId)) {
        toggleWishlist(item);
      }
      closeSelectModal();
    },
    [isInWishlist, toggleWishlist, closeSelectModal],
  );

  const createCollection = useCallback(async (name: string) => {
    toast.info(`Collection "${name}" will be available with account sync.`);
    return { _id: DEFAULT_COLLECTION_ID, name, isDefault: false, items };
  }, []);

  const deleteCollection = useCallback(async () => {
    toast.info("Collections sync coming soon.");
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        collections,
        items,
        isOpen,
        setIsOpen,
        activeCollectionId,
        setActiveCollectionId,
        isLoading: false,
        totalItemCount: items.length,
        isInWishlist,
        toggleWishlist,
        getCollectionsForProduct: (productId) =>
          collections.filter((c) => c.items.some((i) => i.productId === productId)),
        openSelectModal,
        closeSelectModal,
        selectModalOpen,
        pendingItem,
        addToCollections,
        removeFromAllCollections,
        removeFromCollection,
        createCollection,
        deleteCollection,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
