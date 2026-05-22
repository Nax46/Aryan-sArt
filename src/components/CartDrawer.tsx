import { X, Minus, Plus, ShoppingBag, Truck, CreditCard, Tag, Sparkles, LogIn } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { useDrawerLayer } from "@/hooks/useDrawerLayer";
import { getApiUrl, authFetch } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const loadScript = (src: string) =>
  new Promise((resolve) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const CartDrawer = () => {
  const { items, isOpen, setIsOpen, removeItem, updateQty, total, count, clearCart } = useCart();
  const { user, isAuthenticated, setIsAuthModalOpen } = useAuth();
  const navigate = useNavigate();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const hasAddress = !!(user?.profile?.address?.trim() && user?.profile?.pincode?.trim());

  const placeOrder = async (
    paymentMethod: "cod" | "online",
    razorpayOrderId?: string,
    razorpayPaymentId?: string
  ) => {
    const orderItems = items.map((item) => ({
      productId: item.id,
      name: item.name,
      price: item.price,
      quantity: item.qty,
      image: item.image,
    }));

    await authFetch("/user-orders", {
      method: "POST",
      body: JSON.stringify({
        items: orderItems,
        paymentMethod,
        razorpayOrderId,
        razorpayPaymentId,
      }),
    });

    clearCart();
  };

  const handleCheckoutClick = () => {
    if (!user) {
      toast.error("Please login to proceed with checkout");
      setIsOpen(false);
      setIsAuthModalOpen(true);
      return;
    }
    if (!hasAddress) {
      toast.error("Please add your delivery address first");
      setIsOpen(false);
      navigate("/account?tab=address");
      return;
    }
    setShowPaymentModal(true);
  };

  const handleCOD = async () => {
    setIsProcessing(true);
    try {
      await placeOrder("cod");
      toast.success("Order placed! Cash on Delivery selected. We'll contact you soon.");
      setShowPaymentModal(false);
      setIsOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to place order");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOnlinePayment = async () => {
    if (!isAuthenticated || !user) {
      setIsAuthModalOpen(true);
      setShowPaymentModal(false);
      return;
    }
    setIsProcessing(true);
    const loaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!loaded) {
      toast.error("Razorpay SDK failed to load. Check your internet connection.");
      setIsProcessing(false);
      return;
    }

    try {
      const API_URL = getApiUrl();
      const token = localStorage.getItem("canvas_token");

      const orderResponse = await fetch(`${API_URL}/payment/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ amount: total * 100, currency: "INR" }),
      });

      const orderData = await orderResponse.json();
      if (!orderResponse.ok) throw new Error(orderData.error || "Failed to create order");

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_ShhaN6FBWROkMh",
        amount: orderData.amount,
        currency: orderData.currency,
        name: "OnCanvas",
        description: "Purchase from OnCanvas by Aryans Art",
        image: "/ON_CANVAS_FULL_Logo-removebg-preview.png",
        order_id: orderData.order_id,
        handler: async (response: any) => {
          try {
            const verifyRes = await fetch(`${API_URL}/payment/verify-payment`, {
              method: "POST",
              headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              try {
                await placeOrder("online", response.razorpay_order_id, response.razorpay_payment_id);
                toast.success(`Payment successful! Order confirmed.`);
              } catch {
                toast.success(`Payment received. Contact support if order is missing.`);
              }
              setShowPaymentModal(false);
              setIsOpen(false);
            } else {
              toast.error(verifyData.error || "Payment verification failed");
            }
          } catch {
            toast.error("Payment verification error");
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: user?.mobileNumber || user?.email || "",
        },
        theme: { color: "#7E1E1E" },
        modal: { ondismiss: () => setIsProcessing(false) },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", (response: any) => {
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

  useEffect(() => {
    if (!isAuthenticated) {
      setShowPaymentModal(false);
    }
  }, [isAuthenticated]);

  const closeDrawer = useCallback(() => {
    setIsOpen(false);
    setShowPaymentModal(false);
  }, [setIsOpen]);

  useDrawerLayer(isOpen, closeDrawer);

  if (!isOpen) return null;

  const deliveryEstimate = total >= 999 ? "Free delivery" : "₹99 delivery";
  const savings = Math.round(total * 0.1);
  const showLoginGate = !isAuthenticated;

  return createPortal(
    <div className="fixed inset-0 z-[10000]" role="dialog" aria-modal="true" aria-label="Shopping cart">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm cursor-pointer animate-in fade-in duration-200"
        onClick={closeDrawer}
        aria-hidden="true"
      />

      <div className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-background shadow-2xl animate-slide-in-right flex flex-col border-l border-border/40 pointer-events-auto">
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-border/50 bg-gradient-to-b from-primary/[0.03] to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-full bg-primary/10">
                <ShoppingBag className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="font-display text-xl font-medium text-foreground">Shopping Bag</h3>
                <p className="font-body text-[11px] text-muted-foreground mt-0.5">
                  {count} item{count !== 1 ? "s" : ""} in your cart
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={closeDrawer}
              className="relative z-10 p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {items.length > 0 && (
            <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-accent/10 rounded-lg border border-accent/20">
              <Sparkles className="w-3.5 h-3.5 text-accent flex-shrink-0" />
              <p className="font-body text-[11px] text-foreground/80">
                {total >= 999 ? (
                  <span>You qualify for <strong>free delivery</strong>!</span>
                ) : (
                  <span>Add ₹{(999 - total).toLocaleString("en-IN")} more for free delivery</span>
                )}
              </p>
            </div>
          )}
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {showLoginGate ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <LogIn className="w-8 h-8 text-primary" />
              </div>
              <p className="font-display text-lg text-foreground/80 mb-1">Login required</p>
              <p className="font-body text-sm text-muted-foreground mb-6">
                Please log in to add items to your cart and checkout
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setIsAuthModalOpen(true);
                }}
                className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-body text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Log In to Continue
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8 text-primary/30" />
              </div>
              <p className="font-display text-lg text-foreground/80 mb-1">Your bag is empty</p>
              <p className="font-body text-sm text-muted-foreground mb-6">
                Discover handcrafted art pieces curated just for you
              </p>
              <button
                onClick={() => setIsOpen(false)}
                className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-body text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="group flex items-start gap-3 p-3 rounded-xl border border-border/50 bg-card/40 hover:bg-card/80 hover:border-primary/20 transition-all duration-200"
                >
                  <div className="w-[72px] h-[72px] rounded-lg overflow-hidden bg-[#F9F7F5] flex-shrink-0 border border-border/30">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5 text-muted-foreground/20" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm font-medium text-foreground line-clamp-2">{item.name}</p>
                    <p className="font-display text-base font-semibold text-primary mt-1">
                      ₹{item.price.toLocaleString("en-IN")}
                    </p>

                    <div className="flex items-center justify-between mt-2.5">
                      <div className="flex items-center gap-0 border border-border rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQty(item.id, item.qty - 1)}
                          className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-body text-sm w-8 text-center border-x border-border">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.id, item.qty + 1)}
                          className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="font-body text-sm font-semibold text-foreground">
                        ₹{(item.price * item.qty).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1.5 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {isAuthenticated && items.length > 0 && !showPaymentModal && (
          <div className="border-t border-border/50 px-6 py-5 bg-gradient-to-t from-primary/[0.02] to-transparent space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-body text-sm text-muted-foreground flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" /> Subtotal
                </span>
                <span className="font-body text-sm text-foreground">₹{total.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-body text-sm text-muted-foreground flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5" /> Delivery
                </span>
                <span className={cn("font-body text-sm", total >= 999 ? "text-green-600 font-medium" : "text-foreground")}>
                  {deliveryEstimate}
                </span>
              </div>
              {savings > 0 && (
                <div className="flex items-center justify-between text-green-600">
                  <span className="font-body text-xs">You save</span>
                  <span className="font-body text-xs font-medium">₹{savings.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="h-px bg-border/50" />
              <div className="flex items-center justify-between">
                <span className="font-display text-base font-medium text-foreground">Total</span>
                <span className="font-display text-xl font-semibold text-primary">
                  ₹{(total + (total >= 999 ? 0 : 99)).toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <button
              onClick={handleCheckoutClick}
              className="w-full bg-primary text-primary-foreground py-3.5 font-body text-sm font-semibold tracking-wider uppercase rounded-xl hover:bg-primary/90 transition-all shadow-md hover:shadow-lg"
            >
              Proceed to Checkout
            </button>
          </div>
        )}

        {/* Payment Method Selection */}
        {isAuthenticated && showPaymentModal && (
          <div className="border-t border-border/50 px-6 py-6 bg-background animate-in slide-in-from-bottom duration-200">
            <p className="font-display text-lg font-medium text-foreground mb-1">Choose Payment Method</p>
            <p className="font-body text-xs text-muted-foreground mb-5">
              Order Total:{" "}
              <span className="font-semibold text-primary text-sm">
                ₹{(total + (total >= 999 ? 0 : 99)).toLocaleString("en-IN")}
              </span>
            </p>

            <div className="space-y-3">
              <button
                onClick={handleCOD}
                disabled={isProcessing}
                className="w-full flex items-center gap-4 p-4 border-2 border-primary/15 rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-left group"
              >
                <div className="w-11 h-11 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-amber-100 transition-colors border border-amber-200/50">
                  <Truck className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <p className="font-body text-sm font-semibold text-foreground">Cash on Delivery</p>
                  <p className="font-body text-xs text-muted-foreground mt-0.5">Pay when your order arrives</p>
                </div>
              </button>

              <button
                onClick={handleOnlinePayment}
                disabled={isProcessing}
                className="w-full flex items-center gap-4 p-4 border-2 border-primary/15 rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-left group"
              >
                <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors border border-blue-200/50">
                  <CreditCard className="w-5 h-5 text-blue-700" />
                </div>
                <div>
                  <p className="font-body text-sm font-semibold text-foreground">
                    Pay Online {isProcessing && <span className="text-muted-foreground text-xs">(Processing...)</span>}
                  </p>
                  <p className="font-body text-xs text-muted-foreground mt-0.5">UPI, Card, Net Banking via Razorpay</p>
                </div>
              </button>

              <button
                onClick={() => setShowPaymentModal(false)}
                className="w-full py-2.5 font-body text-xs text-muted-foreground hover:text-foreground transition-colors text-center"
              >
                ← Back to Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
};

export default CartDrawer;

