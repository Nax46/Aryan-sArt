import { X, Heart } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

const WishlistDrawer = () => {
  const { items, isOpen, setIsOpen, removeItem } = useWishlist();
  const { addItem: addToCart, setIsOpen: setCartOpen } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-foreground/40 z-[60] cursor-pointer"
        onClick={() => setIsOpen(false)}
      />
      {/* Drawer */}
      <div className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-background z-[70] shadow-2xl animate-slide-in-right flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <h3 className="font-display text-xl font-medium text-foreground">Your Wishlist</h3>
          <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Heart className="w-10 h-10 text-muted-foreground/40 mb-3" />
              <p className="font-body text-sm text-muted-foreground">Your wishlist is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 py-3 border-b border-border/50">
                  <div className="w-16 h-16 bg-card rounded-sm flex-shrink-0 bg-center bg-cover" style={{ backgroundImage: item.image ? `url(${item.image})` : undefined }} />
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-sm font-medium text-foreground truncate">{item.name}</p>
                    <p className="font-body text-sm text-primary mt-0.5">₹{item.price.toLocaleString("en-IN")}</p>
                    <button 
                      onClick={() => {
                        addToCart({ 
                          id: Number(item.id), 
                          name: item.name, 
                          price: item.price 
                        });
                        removeItem(item.id);
                        setIsOpen(false);
                        setCartOpen(true);
                      }}
                      className="mt-2 text-xs font-medium text-secondary hover:underline"
                    >
                      Move to Cart
                    </button>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-primary transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default WishlistDrawer;
