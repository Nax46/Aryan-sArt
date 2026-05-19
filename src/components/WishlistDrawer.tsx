import { X, Heart, ShoppingBag, Trash2, Plus, ChevronRight } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const WishlistDrawer = () => {
  const {
    collections,
    isOpen,
    setIsOpen,
    activeCollectionId,
    setActiveCollectionId,
    removeFromCollection,
    createCollection,
    deleteCollection,
    totalItemCount,
  } = useWishlist();
  const { addItem: addToCart, setIsOpen: setCartOpen } = useCart();
  const navigate = useNavigate();
  const [showNewList, setShowNewList] = useState(false);
  const [newListName, setNewListName] = useState("");

  if (!isOpen) return null;

  const activeCollection = collections.find((c) => c._id === activeCollectionId) || collections[0];
  const items = activeCollection?.items || [];

  const handleCreateList = async () => {
    if (!newListName.trim()) return;
    const col = await createCollection(newListName.trim());
    if (col) {
      setActiveCollectionId(col._id);
      setNewListName("");
      setShowNewList(false);
      toast.success(`"${col.name}" created!`);
    }
  };

  const handleMoveToCart = (item: (typeof items)[0]) => {
    addToCart({
      id: Number(item.productId),
      name: item.name,
      price: item.price,
      image: item.image,
    });
    removeFromCollection(activeCollection!._id, item.productId);
    setIsOpen(false);
    setCartOpen(true);
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-foreground/50 backdrop-blur-[2px] z-[60] cursor-pointer animate-in fade-in duration-200"
        onClick={() => setIsOpen(false)}
      />

      <div className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-background z-[70] shadow-2xl animate-slide-in-right flex flex-col border-l border-border/40">
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-border/50 bg-gradient-to-b from-primary/[0.03] to-transparent">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-full bg-primary/10">
                <Heart className="w-4 h-4 text-primary fill-primary" />
              </div>
              <div>
                <h3 className="font-display text-xl font-medium text-foreground">My Wishlist</h3>
                <p className="font-body text-[11px] text-muted-foreground mt-0.5">
                  {totalItemCount} saved item{totalItemCount !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Collection tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
            {collections.map((col) => (
              <button
                key={col._id}
                onClick={() => setActiveCollectionId(col._id)}
                className={cn(
                  "flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-body font-medium transition-all duration-200 border",
                  activeCollectionId === col._id
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-card text-muted-foreground border-border/60 hover:border-primary/30 hover:text-foreground"
                )}
              >
                {col.name}
                {col.items.length > 0 && (
                  <span className="ml-1.5 opacity-70">({col.items.length})</span>
                )}
              </button>
            ))}
            <button
              onClick={() => setShowNewList(true)}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-body font-medium border border-dashed border-primary/40 text-primary hover:bg-primary/5 transition-all flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              New
            </button>
          </div>

          {showNewList && (
            <div className="mt-3 flex gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
              <Input
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="Wishlist name..."
                className="h-9 text-sm font-body border-primary/20"
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && handleCreateList()}
              />
              <button
                onClick={handleCreateList}
                className="px-4 h-9 bg-primary text-primary-foreground rounded-md text-xs font-body font-medium hover:bg-primary/90 transition-colors"
              >
                Add
              </button>
            </div>
          )}
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center mb-4">
                <Heart className="w-8 h-8 text-primary/30" />
              </div>
              <p className="font-display text-lg text-foreground/80 mb-1">
                {activeCollection?.name || "My List"} is empty
              </p>
              <p className="font-body text-sm text-muted-foreground mb-6">
                Tap the heart on products you love to save them here
              </p>
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate("/#arrivals");
                }}
                className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-body text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Explore Products
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="group flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-card/40 hover:bg-card/80 hover:border-primary/20 hover:shadow-sm transition-all duration-200"
                >
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      navigate(`/product/${item.productId}`);
                    }}
                    className="w-[72px] h-[72px] rounded-lg overflow-hidden bg-[#F9F7F5] flex-shrink-0 border border-border/30 group-hover:scale-[1.02] transition-transform"
                  >
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Heart className="w-5 h-5 text-muted-foreground/20" />
                      </div>
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        navigate(`/product/${item.productId}`);
                      }}
                      className="text-left w-full"
                    >
                      <p className="font-body text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                        {item.name}
                      </p>
                    </button>
                    <p className="font-display text-base font-semibold text-primary mt-1">
                      ₹{item.price.toLocaleString("en-IN")}
                    </p>

                    <button
                      onClick={() => handleMoveToCart(item)}
                      className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-body font-semibold text-primary hover:text-primary/80 transition-colors uppercase tracking-wider"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      Move to Cart
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCollection(activeCollection!._id, item.productId)}
                    className="p-2 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all opacity-0 group-hover:opacity-100"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border/50 px-6 py-4 bg-gradient-to-t from-primary/[0.02] to-transparent">
            {!activeCollection?.isDefault && activeCollection && (
              <button
                onClick={() => deleteCollection(activeCollection._id)}
                className="w-full mb-3 py-2 text-xs font-body text-muted-foreground hover:text-destructive transition-colors"
              >
                Delete "{activeCollection.name}" wishlist
              </button>
            )}
            <button
              onClick={() => {
                setIsOpen(false);
                navigate("/#arrivals");
              }}
              className="w-full py-3 border border-primary/20 text-primary rounded-xl font-body text-sm font-medium hover:bg-primary/5 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default WishlistDrawer;
