import { X, Minus, Plus, ShoppingBag, Truck, CreditCard } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useState } from "react";

const getApiUrl = () => {
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  
  if (hostname === 'www.oncanvas.in' || hostname === 'oncanvas.in') {
    return '/api';
  }
  
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:5000/api';
  }
  return '/api';
};

const loadScript = (src: string) => new Promise((resolve) => {
  if (document.querySelector(`script[src="${src}"]`)) { resolve(true); return; }
  const script = document.createElement('script');
  script.src = src;
  script.onload = () => resolve(true);
  script.onerror = () => resolve(false);
  document.body.appendChild(script);
});

const CartDrawer = () => {
  const { items, isOpen, setIsOpen, removeItem, updateQty, total } = useCart();
  const { user, setIsAuthModalOpen } = useAuth();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckoutClick = () => {
    if (!user) {
      toast.error("Please login to proceed with checkout");
      setIsOpen(false);
      setIsAuthModalOpen(true);
      return;
    }
    setShowPaymentModal(true);
  };

  const handleCOD = () => {
    toast.success("🎉 Order placed! Cash on Delivery selected. We'll contact you soon.");
    setShowPaymentModal(false);
    setIsOpen(false);
  };

  const handleOnlinePayment = async () => {
    setIsProcessing(true);
    const loaded = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
    if (!loaded) {
      toast.error('Razorpay SDK failed to load. Check your internet connection.');
      setIsProcessing(false);
      return;
    }

    try {
      const API_URL = getApiUrl();
      const token = localStorage.getItem('canvas_token');

      const orderResponse = await fetch(`${API_URL}/payment/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ amount: total * 100, currency: 'INR' })
      });

      const orderData = await orderResponse.json();
      if (!orderResponse.ok) throw new Error(orderData.error || 'Failed to create order');

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_ShhaN6FBWROkMh',
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'OnCanvas',
        description: 'Purchase from OnCanvas by Aryans Art',
        image: '/ON_CANVAS_FULL_Logo-removebg-preview.png',
        order_id: orderData.order_id,
        handler: async (response: any) => {
          try {
            const verifyRes = await fetch(`${API_URL}/payment/verify-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });
            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              toast.success(`✅ Payment successful! ID: ${response.razorpay_payment_id}`);
              setShowPaymentModal(false);
              setIsOpen(false);
            } else {
              toast.error(verifyData.error || 'Payment verification failed');
            }
          } catch {
            toast.error('Payment verification error');
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.mobileNumber || user?.email || ''
        },
        theme: { color: '#7E1E1E' },
        modal: { ondismiss: () => setIsProcessing(false) }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', (response: any) => {
        toast.error(response.error.description);
        setIsProcessing(false);
      });
      rzp.open();
      setShowPaymentModal(false);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-foreground/40 z-[60] cursor-pointer" onClick={() => { setIsOpen(false); setShowPaymentModal(false); }} />

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
                  <div className="w-16 h-16 bg-card rounded-sm flex-shrink-0 overflow-hidden">
                    {(item as any).image && <img src={(item as any).image} alt={item.name} className="w-full h-full object-cover" />}
                  </div>
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

        {/* Footer - Checkout Button */}
        {items.length > 0 && !showPaymentModal && (
          <div className="border-t border-border px-6 py-5">
            <div className="flex items-center justify-between mb-4">
              <span className="font-body text-sm text-muted-foreground">Subtotal</span>
              <span className="font-display text-lg font-medium text-foreground">₹{total.toLocaleString("en-IN")}</span>
            </div>
            <button
              onClick={handleCheckoutClick}
              className="w-full bg-[#7E1E1E] text-white py-3 font-body text-sm tracking-wider uppercase rounded-lg hover:bg-[#7E1E1E]/90 transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        )}

        {/* Payment Method Selection */}
        {showPaymentModal && (
          <div className="border-t border-border px-6 py-6 bg-background">
            <p className="font-display text-base font-semibold text-foreground mb-1">Choose Payment Method</p>
            <p className="font-body text-xs text-muted-foreground mb-5">Order Total: <span className="font-semibold text-foreground">₹{total.toLocaleString("en-IN")}</span></p>

            <div className="space-y-3">
              <button
                onClick={handleCOD}
                disabled={isProcessing}
                className="w-full flex items-center gap-4 p-4 border-2 border-[#7E1E1E]/20 rounded-xl hover:border-[#7E1E1E] hover:bg-[#7E1E1E]/5 transition-all text-left group"
              >
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-amber-200 transition-colors">
                  <Truck className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <p className="font-body text-sm font-semibold text-foreground">Cash on Delivery</p>
                  <p className="font-body text-xs text-muted-foreground">Pay when your order arrives at your door</p>
                </div>
              </button>

              <button
                onClick={handleOnlinePayment}
                disabled={isProcessing}
                className="w-full flex items-center gap-4 p-4 border-2 border-[#7E1E1E]/20 rounded-xl hover:border-[#7E1E1E] hover:bg-[#7E1E1E]/5 transition-all text-left group"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 transition-colors">
                  <CreditCard className="w-5 h-5 text-blue-700" />
                </div>
                <div>
                  <p className="font-body text-sm font-semibold text-foreground">
                    Pay Online {isProcessing && <span className="text-muted-foreground text-xs">(Processing...)</span>}
                  </p>
                  <p className="font-body text-xs text-muted-foreground">UPI, Card, Net Banking via Razorpay</p>
                </div>
              </button>

              <button
                onClick={() => setShowPaymentModal(false)}
                className="w-full py-2 font-body text-xs text-muted-foreground hover:text-foreground transition-colors text-center"
              >
                ← Back to Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
