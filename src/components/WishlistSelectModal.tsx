import { useState, useEffect } from "react";
import { Plus, Heart, Check, ListPlus, X } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const WishlistSelectModal = () => {
  const {
    selectModalOpen,
    closeSelectModal,
    pendingItem,
    collections,
    addToCollections,
    getCollectionsForProduct,
  } = useWishlist();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showCreateNew, setShowCreateNew] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (selectModalOpen && pendingItem) {
      const existing = getCollectionsForProduct(pendingItem.productId);
      if (existing.length > 0) {
        setSelectedIds(existing.map((c) => c._id));
      } else {
        const defaultCol = collections.find((c) => c.isDefault) || collections[0];
        setSelectedIds(defaultCol ? [defaultCol._id] : []);
      }
      setShowCreateNew(false);
      setNewListName("");
    }
  }, [selectModalOpen, pendingItem, collections, getCollectionsForProduct]);

  if (!selectModalOpen || !pendingItem) return null;

  const toggleCollection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    if (selectedIds.length === 0 && !newListName.trim()) {
      return;
    }
    setIsSaving(true);
    try {
      await addToCollections(selectedIds, pendingItem, newListName.trim() || undefined);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-foreground/50 backdrop-blur-[2px] z-[80] animate-in fade-in duration-200"
        onClick={closeSelectModal}
      />

      {/* Bottom sheet — Flipkart-style */}
      <div className="fixed bottom-0 left-0 right-0 z-[90] animate-in slide-in-from-bottom duration-300">
        <div className="mx-auto max-w-lg bg-background rounded-t-2xl shadow-2xl border border-border/60 overflow-hidden">
          {/* Handle bar */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-border" />
          </div>

          {/* Header with product preview */}
          <div className="px-5 pb-4 border-b border-border/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-primary fill-primary" />
                <h3 className="font-display text-lg font-medium text-foreground">Save to Wishlist</h3>
              </div>
              <button
                onClick={closeSelectModal}
                className="p-1.5 rounded-full hover:bg-muted transition-colors text-muted-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-3 p-3 bg-card/60 rounded-xl border border-border/40">
              <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#F9F7F5] flex-shrink-0 border border-border/30">
                {pendingItem.image ? (
                  <img src={pendingItem.image} alt={pendingItem.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Heart className="w-5 h-5 text-muted-foreground/30" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm font-medium text-foreground line-clamp-2">{pendingItem.name}</p>
                <p className="font-display text-base font-semibold text-primary mt-0.5">
                  ₹{pendingItem.price.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </div>

          {/* Wishlist options */}
          <div className="px-5 py-4 max-h-[40vh] overflow-y-auto space-y-2">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-body mb-3">
              Select Wishlist
            </p>

            {collections.map((col) => {
              const isSelected = selectedIds.includes(col._id);
              const hasItem = col.items.some((i) => i.productId === pendingItem.productId);

              return (
                <button
                  key={col._id}
                  onClick={() => toggleCollection(col._id)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all duration-200 text-left",
                    isSelected
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border/60 hover:border-primary/30 hover:bg-card/50"
                  )}
                >
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all",
                      isSelected ? "border-primary bg-primary" : "border-muted-foreground/40"
                    )}
                  >
                    {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm font-medium text-foreground">{col.name}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {col.items.length} item{col.items.length !== 1 ? "s" : ""}
                      {hasItem && " · Already saved"}
                    </p>
                  </div>
                  {col.isDefault && (
                    <span className="text-[9px] uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full font-body">
                      Default
                    </span>
                  )}
                </button>
              );
            })}

            {/* Create new wishlist */}
            {!showCreateNew ? (
              <button
                onClick={() => setShowCreateNew(true)}
                className="w-full flex items-center gap-3 p-3.5 rounded-xl border-2 border-dashed border-primary/30 hover:border-primary/60 hover:bg-primary/5 transition-all text-left group"
              >
                <div className="w-5 h-5 rounded-full border-2 border-primary/40 flex items-center justify-center group-hover:border-primary transition-colors">
                  <Plus className="w-3 h-3 text-primary" />
                </div>
                <div className="flex items-center gap-2">
                  <ListPlus className="w-4 h-4 text-primary" />
                  <span className="font-body text-sm font-medium text-primary">Create New Wishlist</span>
                </div>
              </button>
            ) : (
              <div className="p-3.5 rounded-xl border-2 border-primary/30 bg-primary/5 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                <p className="font-body text-xs font-medium text-foreground">New Wishlist Name</p>
                <Input
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="e.g. Birthday Gifts, Home Decor..."
                  className="border-primary/20 focus-visible:ring-primary/30 font-body"
                  autoFocus
                  maxLength={50}
                />
                <button
                  onClick={() => {
                    setShowCreateNew(false);
                    setNewListName("");
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground font-body"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Footer CTA */}
          <div className="px-5 py-4 border-t border-border/50 bg-card/30">
            <button
              onClick={handleSave}
              disabled={isSaving || (selectedIds.length === 0 && !newListName.trim())}
              className={cn(
                "w-full py-3.5 rounded-xl font-body text-sm font-semibold tracking-wide uppercase transition-all duration-200",
                "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              )}
            >
              {isSaving ? "Saving..." : "Done"}
            </button>
          </div>

          {/* Safe area for mobile */}
          <div className="h-safe-area-bottom pb-2" />
        </div>
      </div>
    </>
  );
};

export default WishlistSelectModal;
