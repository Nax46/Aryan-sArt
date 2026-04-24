import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const CartDrawer = () => {
  const { items, isOpen, setIsOpen, removeItem, updateQty, total } = useCart();
  const { user, setIsAuthModalOpen } = useAuth();

  const handleCheckout = async () => {
    if (!user) {
      toast.error("Please login to proceed with checkout");
      setIsOpen(false);
      setIsAuthModalOpen(true);
      return;
    }

    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
    if (!res) {
      toast.error('Razorpay SDK failed to load');
      return;
    }

    const options = {
      key: 'rzp_test_dummykey12345', // Dummy key for testing UI
      amount: total * 100,
      currency: 'INR',
      name: 'Canvas',
      description: 'Purchase from Canvas',
      image: '/logo-remove.png',
      handler: function(response: any) {
        toast.success(`Payment successful! ID: ${response.razorpay_payment_id}`);
        // Here you would clear cart and save order to DB
        setIsOpen(false);
      },
      prefill: {
        name: user.user_metadata?.full_name || 'Guest User',
        email: user.email || 'guest@example.com',
        contact: '9999999999'
      },
      theme: {
        color: '#4a2511' // primary color approx
      }
    };

    const rzp1 = new (window as any).Razorpay(options);
    rzp1.on('payment.failed', function (response: any){
      toast.error(response.error.description);
    });
    rzp1.open();
  };

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
          <h3 className="font-display text-xl font-medium text-foreground">Your Cart</h3>
          <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-10 h-10 text-muted-foreground/40 mb-3" />
              <p className="font-body text-sm text-muted-foreground">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 py-3 border-b border-border/50">
                  <div className="w-16 h-16 bg-card rounded-sm flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-sm font-medium text-foreground truncate">{item.name}</p>
                    <p className="font-body text-sm text-primary mt-0.5">₹{item.price.toLocaleString("en-IN")}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-6 h-6 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-body text-sm w-6 text-center">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-6 h-6 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-primary transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border px-6 py-5">
            <div className="flex items-center justify-between mb-4">
              <span className="font-body text-sm text-muted-foreground">Subtotal</span>
              <span className="font-display text-lg font-medium text-foreground">₹{total.toLocaleString("en-IN")}</span>
            </div>
            <button 
              onClick={handleCheckout}
              className="w-full bg-primary text-primary-foreground py-3 font-body text-sm tracking-wider uppercase hover:bg-primary/90 transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

const loadScript = (src: string) => new Promise((resolve) => {
  const script = document.createElement('script');
  script.src = src;
  script.onload = () => resolve(true);
  script.onerror = () => resolve(false);
  document.body.appendChild(script);
});

export default CartDrawer;
