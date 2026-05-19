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

const createDefaultGuestCollections = (): WishlistCollection[] => [
  {
    _id: "local-default",
    name: "My List",
    isDefault: true,
    items: [],
  },
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
  const { user, token, isAuthenticated } = useAuth();
  const [collections, setCollections] = useState<WishlistCollection[]>(createDefaultGuestCollections());
  const [isOpen, setIsOpen] = useState(false);
  const [activeCollectionId, setActiveCollectionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectModalOpen, setSelectModalOpen] = useState(false);
  const [pendingItem, setPendingItem] = useState<PendingWishlistItem | null>(null);

  const saveGuestCollections = useCallback((cols: WishlistCollection[]) => {
    setCollections(cols);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cols));
  }, []);

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
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const syncGuestToServer = useCallback(async () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored || !token) return;

    try {
      const guestCols = JSON.parse(stored);
      const result = await authFetch("/wishlists/sync", {
        method: "POST",
        body: JSON.stringify({ collections: guestCols }),
      });
      const cols = (result.data || []).map(normalizeCollection);
      setCollections(cols);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cols));
    } catch (error) {
      console.error("Wishlist sync failed:", error);
      await fetchCollections();
    }
  }, [token, fetchCollections]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCollections(parsed.map(normalizeCollection));
        }
      } catch {
        /* ignore */
      }
    }

    // Migrate old flat wishlist format
    const oldStored = localStorage.getItem("canvas_wishlist");
    if (oldStored && !stored) {
      try {
        const oldItems = JSON.parse(oldStored);
        if (Array.isArray(oldItems) && oldItems.length > 0) {
          const migrated = createDefaultGuestCollections();
          migrated[0].items = oldItems.map((item: any) => ({
            productId: String(item.id),
            name: item.name,
            price: item.price,
            image: item.image,
          }));
          saveGuestCollections(migrated);
          localStorage.removeItem("canvas_wishlist");
        }
      } catch {
        /* ignore */
      }
    }
  }, [saveGuestCollections]);

  useEffect(() => {
    if (isAuthenticated && token) {
      syncGuestToServer();
    } else if (!isAuthenticated) {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          setCollections(JSON.parse(stored).map(normalizeCollection));
        } catch {
          setCollections(createDefaultGuestCollections());
        }
      }
    }
  }, [isAuthenticated, token, syncGuestToServer]);

  useEffect(() => {
    if (collections.length > 0 && !activeCollectionId) {
      const defaultCol = collections.find((c) => c.isDefault) || collections[0];
      setActiveCollectionId(defaultCol._id);
    }
  }, [collections, activeCollectionId]);

  const totalItemCount = useMemo(() => {
    const uniqueIds = new Set<string>();
    collections.forEach((col) => col.items.forEach((item) => uniqueIds.add(item.productId)));
    return uniqueIds.size;
  }, [collections]);

  const isInWishlist = useCallback(
    (productId: string) =>
      collections.some((col) => col.items.some((item) => item.productId === productId)),
    [collections]
  );

  const getCollectionsForProduct = useCallback(
    (productId: string) =>
      collections.filter((col) => col.items.some((item) => item.productId === productId)),
    [collections]
  );

  const openSelectModal = useCallback((item: PendingWishlistItem) => {
    setPendingItem(item);
    setSelectModalOpen(true);
  }, []);

  const closeSelectModal = useCallback(() => {
    setSelectModalOpen(false);
    setPendingItem(null);
  }, []);

  const createCollectionInternal = useCallback(
    async (name: string): Promise<WishlistCollection | null> => {
      if (isAuthenticated && token) {
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
      }

      const newCol: WishlistCollection = {
        _id: `local-${Date.now()}`,
        name,
        isDefault: false,
        items: [],
      };
      setCollections((prev) => {
        const updated = [...prev, newCol];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
      return newCol;
    },
    [isAuthenticated, token]
  );

  const addToCollections = useCallback(
    async (collectionIds: string[], item: PendingWishlistItem, newListName?: string) => {
      let targetIds = [...collectionIds];

      if (newListName?.trim()) {
        const newCol = await createCollectionInternal(newListName.trim());
        if (newCol) targetIds.push(newCol._id);
      }

      if (targetIds.length === 0) {
        toast.error("Please select at least one wishlist");
        return;
      }

      if (isAuthenticated && token) {
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
      } else {
        setCollections((prev) => {
          const updated = prev.map((col) => {
            if (!targetIds.includes(col._id)) return col;
            if (col.items.some((i) => i.productId === item.productId)) return col;
            return {
              ...col,
              items: [...col.items, { ...item, addedAt: new Date().toISOString() }],
            };
          });
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          return updated;
        });
      }

      toast.success("Saved to wishlist!");
      closeSelectModal();
    },
    [isAuthenticated, token, fetchCollections, closeSelectModal, createCollectionInternal]
  );

  const createCollection = useCallback(
    async (name: string) => createCollectionInternal(name),
    [createCollectionInternal]
  );

  const removeFromCollection = useCallback(
    async (collectionId: string, productId: string) => {
      if (isAuthenticated && token) {
        try {
          await authFetch(`/wishlists/${collectionId}/items/${productId}`, { method: "DELETE" });
          await fetchCollections();
        } catch (error: any) {
          toast.error(error.message);
        }
      } else {
        const updated = collections.map((col) =>
          col._id === collectionId
            ? { ...col, items: col.items.filter((i) => i.productId !== productId) }
            : col
        );
        saveGuestCollections(updated);
      }
      toast.success("Removed from wishlist");
    },
    [collections, isAuthenticated, token, fetchCollections, saveGuestCollections]
  );

  const removeFromAllCollections = useCallback(
    async (productId: string) => {
      const colsWithProduct = collections.filter((col) =>
        col.items.some((item) => item.productId === productId)
      );

      for (const col of colsWithProduct) {
        await removeFromCollection(col._id, productId);
      }
    },
    [collections, removeFromCollection]
  );

  const deleteCollection = useCallback(
    async (collectionId: string) => {
      if (isAuthenticated && token) {
        try {
          await authFetch(`/wishlists/${collectionId}`, { method: "DELETE" });
          await fetchCollections();
          toast.success("Wishlist deleted");
        } catch (error: any) {
          toast.error(error.message);
        }
      } else {
        const updated = collections.filter((c) => c._id !== collectionId);
        saveGuestCollections(updated.length ? updated : createDefaultGuestCollections());
        toast.success("Wishlist deleted");
      }
    },
    [collections, isAuthenticated, token, fetchCollections, saveGuestCollections]
  );

  return (
    <WishlistContext.Provider
      value={{
        collections,
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
