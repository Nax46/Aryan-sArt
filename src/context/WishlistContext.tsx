import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";
import { authFetch } from "@/lib/api";

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
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  activeCollectionId: string | null;
  setActiveCollectionId: (id: string | null) => void;
  isLoading: boolean;
  totalItemCount: number;
  isInWishlist: (productId: string) => boolean;
  getCollectionsForProduct: (productId: string) => WishlistCollection[];
  openSelectModal: (item: PendingWishlistItem) => void;
  closeSelectModal: () => void;
  selectModalOpen: boolean;
  pendingItem: PendingWishlistItem | null;
  addToCollections: (collectionIds: string[], item: PendingWishlistItem, newListName?: string) => Promise<void>;
  removeFromAllCollections: (productId: string) => Promise<void>;
  removeFromCollection: (collectionId: string, productId: string) => Promise<void>;
  createCollection: (name: string) => Promise<WishlistCollection | null>;
  deleteCollection: (collectionId: string) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

const STORAGE_KEY = "canvas_wishlists";

const emptyCollections = (): WishlistCollection[] => [
  { _id: "empty", name: "My List", isDefault: true, items: [] },
];

const normalizeCollection = (raw: any): WishlistCollection => ({
  _id: raw._id?.toString?.() || raw._id || raw.id || `local-${Date.now()}`,
  name: raw.name || "My List",
  isDefault: !!raw.isDefault,
  items: (raw.items || []).map((item: any) => ({
    productId: String(item.productId || item.id),
    name: item.name,
    price: item.price,
    image: item.image,
    addedAt: item.addedAt,
  })),
});

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
};

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, isAuthenticated, setIsAuthModalOpen } = useAuth();
  const [collections, setCollections] = useState<WishlistCollection[]>(emptyCollections());
  const [isOpen, setIsOpenRaw] = useState(false);
  const [activeCollectionId, setActiveCollectionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectModalOpen, setSelectModalOpen] = useState(false);
  const [pendingItem, setPendingItem] = useState<PendingWishlistItem | null>(null);

  const fetchCollections = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const result = await authFetch("/wishlists");
      const cols = (result.data || []).map(normalizeCollection);
      setCollections(cols);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cols));
    } catch (error) {
      console.error("Failed to fetch wishlists:", error);
      setCollections(emptyCollections());
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const syncGuestToServer = useCallback(async () => {
    if (!token) return;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      await fetchCollections();
      return;
    }
    try {
      const guestCols = JSON.parse(stored);
      const result = await authFetch("/wishlists/sync", {
        method: "POST",
        body: JSON.stringify({ collections: guestCols }),
      });
      const cols = (result.data || []).map(normalizeCollection);
      setCollections(cols);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cols));
    } catch {
      await fetchCollections();
    }
  }, [token, fetchCollections]);

  // Logged out: empty wishlist, close UI
  useEffect(() => {
    if (!isAuthenticated || !token) {
      setCollections(emptyCollections());
      setIsOpenRaw(false);
      setSelectModalOpen(false);
      setPendingItem(null);
      setActiveCollectionId(null);
      return;
    }
    syncGuestToServer();
  }, [isAuthenticated, token, syncGuestToServer]);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (collections.length > 0 && !activeCollectionId) {
      const defaultCol = collections.find((c) => c.isDefault) || collections[0];
      setActiveCollectionId(defaultCol._id);
    }
  }, [collections, activeCollectionId, isAuthenticated]);

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

  const totalItemCount = useMemo(() => {
    if (!isAuthenticated) return 0;
    const uniqueIds = new Set<string>();
    collections.forEach((col) => col.items.forEach((item) => uniqueIds.add(item.productId)));
    return uniqueIds.size;
  }, [collections, isAuthenticated]);

  const isInWishlist = useCallback(
    (productId: string) => {
      if (!isAuthenticated) return false;
      return collections.some((col) => col.items.some((item) => item.productId === productId));
    },
    [collections, isAuthenticated]
  );

  const getCollectionsForProduct = useCallback(
    (productId: string) => {
      if (!isAuthenticated) return [];
      return collections.filter((col) => col.items.some((item) => item.productId === productId));
    },
    [collections, isAuthenticated]
  );

  const openSelectModal = useCallback(
    (item: PendingWishlistItem) => {
      if (!isAuthenticated) {
        setIsAuthModalOpen(true);
        return;
      }
      setPendingItem(item);
      setSelectModalOpen(true);
    },
    [isAuthenticated, setIsAuthModalOpen]
  );

  const closeSelectModal = useCallback(() => {
    setSelectModalOpen(false);
    setPendingItem(null);
  }, []);

  const createCollectionInternal = useCallback(
    async (name: string): Promise<WishlistCollection | null> => {
      if (!isAuthenticated || !token) {
        setIsAuthModalOpen(true);
        return null;
      }
      try {
        const result = await authFetch("/wishlists", {
          method: "POST",
          body: JSON.stringify({ name }),
        });
        const col = normalizeCollection(result.data);
        setCollections((prev) => [...prev, col]);
        return col;
      } catch (error: any) {
        toast.error(error.message);
        return null;
      }
    },
    [isAuthenticated, token, setIsAuthModalOpen]
  );

  const addToCollections = useCallback(
    async (collectionIds: string[], item: PendingWishlistItem, newListName?: string) => {
      if (!isAuthenticated || !token) {
        setIsAuthModalOpen(true);
        return;
      }

      let targetIds = [...collectionIds];
      if (newListName?.trim()) {
        const newCol = await createCollectionInternal(newListName.trim());
        if (newCol) targetIds.push(newCol._id);
      }

      if (targetIds.length === 0) {
        toast.error("Please select at least one wishlist");
        return;
      }

      for (const colId of targetIds) {
        try {
          await authFetch(`/wishlists/${colId}/items`, {
            method: "POST",
            body: JSON.stringify(item),
          });
        } catch (error: any) {
          if (!error.message?.includes("already")) {
            toast.error(error.message);
          }
        }
      }
      await fetchCollections();
      toast.success("Saved to wishlist!");
      closeSelectModal();
    },
    [isAuthenticated, token, fetchCollections, closeSelectModal, createCollectionInternal, setIsAuthModalOpen]
  );

  const createCollection = useCallback(
    async (name: string) => createCollectionInternal(name),
    [createCollectionInternal]
  );

  const removeFromCollection = useCallback(
    async (collectionId: string, productId: string) => {
      if (!isAuthenticated || !token) return;
      try {
        await authFetch(`/wishlists/${collectionId}/items/${productId}`, { method: "DELETE" });
        await fetchCollections();
        toast.success("Removed from wishlist");
      } catch (error: any) {
        toast.error(error.message);
      }
    },
    [isAuthenticated, token, fetchCollections]
  );

  const removeFromAllCollections = useCallback(
    async (productId: string) => {
      if (!isAuthenticated) return;
      const colsWithProduct = collections.filter((col) =>
        col.items.some((item) => item.productId === productId)
      );
      for (const col of colsWithProduct) {
        await removeFromCollection(col._id, productId);
      }
    },
    [collections, isAuthenticated, removeFromCollection]
  );

  const deleteCollection = useCallback(
    async (collectionId: string) => {
      if (!isAuthenticated || !token) return;
      try {
        await authFetch(`/wishlists/${collectionId}`, { method: "DELETE" });
        await fetchCollections();
        toast.success("Wishlist deleted");
      } catch (error: any) {
        toast.error(error.message);
      }
    },
    [isAuthenticated, token, fetchCollections]
  );

  return (
    <WishlistContext.Provider
      value={{
        collections: isAuthenticated ? collections : emptyCollections(),
        isOpen,
        setIsOpen,
        activeCollectionId,
        setActiveCollectionId,
        isLoading,
        totalItemCount,
        isInWishlist,
        getCollectionsForProduct,
        openSelectModal,
        closeSelectModal,
        selectModalOpen: isAuthenticated && selectModalOpen,
        pendingItem: isAuthenticated ? pendingItem : null,
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
