import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import {
  User,
  Package,
  MapPin,
  Lock,
  Heart,
  LogOut,
  Smartphone,
  Mail,
  Home,
  Building2,
  Hash,
  Landmark,
  Loader2,
  ChevronRight,
  ShoppingBag,
  Shield,
  Eye,
  EyeOff,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnnouncementBar from "@/components/AnnouncementBar";
import AuthModal from "@/components/AuthModal";
import CartDrawer from "@/components/CartDrawer";
import WishlistDrawer from "@/components/WishlistDrawer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { authFetch } from "@/lib/api";
import { cn } from "@/lib/utils";

type AccountTab = "profile" | "orders" | "address" | "security";

interface OrderItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface UserOrder {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
}

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  confirmed: "bg-blue-100 text-blue-800 border-blue-200",
  processing: "bg-indigo-100 text-indigo-800 border-indigo-200",
  shipped: "bg-purple-100 text-purple-800 border-purple-200",
  delivered: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
};

const NAV_ITEMS: { id: AccountTab; label: string; icon: typeof User; desc: string }[] = [
  { id: "profile", label: "Profile", icon: User, desc: "Personal details" },
  { id: "orders", label: "My Orders", icon: Package, desc: "Order history" },
  { id: "address", label: "Address", icon: MapPin, desc: "Delivery address" },
  { id: "security", label: "Security", icon: Lock, desc: "Password & login" },
];

const Field = ({
  icon: Icon,
  label,
  children,
  required,
  className,
}: {
  icon: typeof User;
  label: string;
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}) => (
  <div className={className}>
    <label className="flex items-center gap-1.5 text-xs font-body font-medium text-muted-foreground mb-1.5">
      <Icon className="w-3.5 h-3.5" />
      {label}
      {required && <span className="text-primary">*</span>}
    </label>
    {children}
  </div>
);

const PasswordField = ({
  label,
  value,
  onChange,
  show,
  onToggle,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggle: () => void;
  required?: boolean;
}) => (
  <div>
    <label className="flex items-center gap-1.5 text-xs font-body font-medium text-muted-foreground mb-1.5">
      <Lock className="w-3.5 h-3.5" />
      {label}
      {required && <span className="text-primary">*</span>}
    </label>
    <div className="relative">
      <Input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="font-body pr-10"
        required={required}
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
      >
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  </div>
);

const AccountPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, isAuthenticated, isLoading: authLoading, logout, updateProfile, changePassword } = useAuth();
  const { totalItemCount, setIsOpen: setWishlistOpen } = useWishlist();

  const tabParam = searchParams.get("tab") as AccountTab | null;
  const activeTab: AccountTab =
    tabParam && NAV_ITEMS.some((n) => n.id === tabParam) ? tabParam : "profile";

  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [landmark, setLandmark] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setAddress(user.profile?.address || "");
      setCity(user.profile?.city || "");
      setState(user.profile?.state || "");
      setPincode(user.profile?.pincode || "");
      setLandmark(user.profile?.landmark || "");
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === "orders" && isAuthenticated) {
      setOrdersLoading(true);
      authFetch("/user-orders")
        .then((res) => setOrders(res.data || []))
        .catch(() => setOrders([]))
        .finally(() => setOrdersLoading(false));
    }
  }, [activeTab, isAuthenticated]);

  const setTab = (tab: AccountTab) => setSearchParams({ tab });

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    try {
      await updateProfile({ name: name.trim(), email: email.trim() });
    } finally {
      setProfileSaving(false);
    }
  };

  const handleAddressSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    try {
      await updateProfile({
        profile: {
          address: address.trim(),
          city: city.trim(),
          state: state.trim(),
          pincode: pincode.replace(/\D/g, "").slice(0, 6),
          landmark: landmark.trim(),
        },
      });
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    const current = currentPassword.trim();
    const next = newPassword.trim();
    const confirm = confirmPassword.trim();

    if (!current || !next || !confirm) {
      setPasswordError("Please fill in all password fields");
      return;
    }
    if (next.length < 8) {
      setPasswordError("New password must be at least 8 characters");
      return;
    }
    if (next !== confirm) {
      setPasswordError("New password and confirm password do not match");
      return;
    }
    if (current === next) {
      setPasswordError("New password must be different from current password");
      return;
    }

    setPasswordSaving(true);
    try {
      await changePassword(current, next);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordError("");
    } catch (error: any) {
      setPasswordError(error.message || "Failed to change password");
    } finally {
      setPasswordSaving(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
    : null;

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <Navbar />
      <AuthModal />
      <CartDrawer />
      <WishlistDrawer />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-28">
        <div className="mb-8">
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-body mb-2">My Account</p>
          <h1 className="font-display text-3xl md:text-4xl font-light text-foreground">Account Settings</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <aside className="lg:w-72 flex-shrink-0">
            <div className="bg-card border border-border/60 rounded-2xl p-5 mb-4 shadow-sm">
              <div className="flex items-center gap-4">
                <Avatar className="w-14 h-14 border-2 border-primary/20">
                  <AvatarImage src={user.profile?.avatar} />
                  <AvatarFallback className="bg-primary text-primary-foreground font-display text-lg">
                    {user.name?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-display text-lg font-medium text-foreground truncate">{user.name}</p>
                  <p className="font-body text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Smartphone className="w-3 h-3" />
                    +91 {user.mobileNumber}
                  </p>
                  {memberSince && (
                    <p className="text-[10px] text-muted-foreground mt-1">Member since {memberSince}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-border/50">
                <button
                  type="button"
                  onClick={() => setTab("orders")}
                  className="flex flex-col items-center gap-1 p-2.5 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors"
                >
                  <Package className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-body text-muted-foreground">Orders</span>
                </button>
                <button
                  type="button"
                  onClick={() => setWishlistOpen(true)}
                  className="flex flex-col items-center gap-1 p-2.5 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors"
                >
                  <Heart className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-body text-muted-foreground">
                    Wishlist{totalItemCount > 0 ? ` (${totalItemCount})` : ""}
                  </span>
                </button>
              </div>
            </div>

            <nav className="bg-card border border-border/60 rounded-2xl overflow-hidden shadow-sm">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTab(item.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all border-b border-border/30 last:border-0",
                      isActive ? "bg-primary/8 text-primary" : "hover:bg-muted/50 text-foreground/80"
                    )}
                  >
                    <div
                      className={cn(
                        "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
                        isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="font-body text-sm font-medium">{item.label}</p>
                      <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                    </div>
                    <ChevronRight
                      className={cn("w-4 h-4 flex-shrink-0", isActive ? "text-primary" : "text-muted-foreground/40")}
                    />
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left text-destructive hover:bg-destructive/5 transition-colors border-t border-border/30"
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-destructive/10">
                  <LogOut className="w-4 h-4" />
                </div>
                <span className="font-body text-sm font-medium">Logout</span>
              </button>
            </nav>
          </aside>

          <div className="flex-1 min-w-0">
            {activeTab === "profile" && (
              <div className="bg-card border border-border/60 rounded-2xl p-6 md:p-8 shadow-sm">
                <SectionHeader icon={User} title="Personal Information" subtitle="Update your name and contact details" />
                <form onSubmit={handleProfileSave} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Field icon={User} label="Full Name" required>
                      <Input value={name} onChange={(e) => setName(e.target.value)} required className="font-body" />
                    </Field>
                    <Field icon={Smartphone} label="Mobile Number">
                      <Input value={user.mobileNumber} disabled className="font-body bg-muted/50 cursor-not-allowed" />
                      <p className="text-[10px] text-muted-foreground mt-1">Cannot be changed</p>
                    </Field>
                    <Field icon={Mail} label="Email Address" className="sm:col-span-2">
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="font-body"
                      />
                    </Field>
                  </div>
                  <SaveButton loading={profileSaving} label="Save Changes" />
                </form>
              </div>
            )}

            {activeTab === "address" && (
              <div className="bg-card border border-border/60 rounded-2xl p-6 md:p-8 shadow-sm">
                <SectionHeader icon={MapPin} title="Delivery Address" subtitle="Required for checkout and delivery" />
                <form onSubmit={handleAddressSave} className="space-y-5">
                  <Field icon={Home} label="Street Address" required>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows={3}
                      required
                      placeholder="House no., Street, Area"
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-body focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </Field>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Field icon={Building2} label="City" required>
                      <Input value={city} onChange={(e) => setCity(e.target.value)} required className="font-body" />
                    </Field>
                    <Field icon={MapPin} label="State">
                      <Input value={state} onChange={(e) => setState(e.target.value)} className="font-body" />
                    </Field>
                    <Field icon={Hash} label="Pincode" required>
                      <Input
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        maxLength={6}
                        required
                        className="font-body"
                      />
                    </Field>
                    <Field icon={Landmark} label="Landmark (Optional)">
                      <Input value={landmark} onChange={(e) => setLandmark(e.target.value)} className="font-body" />
                    </Field>
                  </div>
                  <SaveButton loading={profileSaving} label="Save Address" />
                </form>
              </div>
            )}

            {activeTab === "orders" && (
              <div className="bg-card border border-border/60 rounded-2xl p-6 md:p-8 shadow-sm">
                <SectionHeader icon={Package} title="My Orders" subtitle="Track and view your order history" />
                {ordersLoading ? (
                  <div className="flex justify-center py-16">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center mx-auto mb-4">
                      <ShoppingBag className="w-8 h-8 text-primary/30" />
                    </div>
                    <p className="font-display text-lg text-foreground/80 mb-1">No orders yet</p>
                    <p className="font-body text-sm text-muted-foreground mb-6">Orders appear here after checkout</p>
                    <Link
                      to="/#arrivals"
                      className="inline-flex px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-body text-sm font-medium"
                    >
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order._id} className="border border-border/50 rounded-xl p-4">
                        <div className="flex flex-wrap justify-between gap-2 mb-3">
                          <div>
                            <p className="font-body text-sm font-semibold">#{order.orderNumber}</p>
                            <p className="text-[11px] text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                "text-[10px] font-medium uppercase px-2 py-0.5 rounded-full border",
                                STATUS_STYLES[order.status] || STATUS_STYLES.pending
                              )}
                            >
                              {order.status}
                            </span>
                            <span className="font-display font-semibold text-primary">
                              ₹{order.totalAmount.toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3 text-sm py-1">
                            <div className="w-10 h-10 rounded-lg bg-[#F9F7F5] overflow-hidden border border-border/30">
                              {item.image && <img src={item.image} alt="" className="w-full h-full object-cover" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-body truncate">{item.name}</p>
                              <p className="text-[11px] text-muted-foreground">Qty: {item.quantity}</p>
                            </div>
                            <p className="font-body font-medium">
                              ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                            </p>
                          </div>
                        ))}
                        <div className="mt-2 pt-2 border-t border-border/40 text-[11px] text-muted-foreground capitalize">
                          {order.paymentMethod === "cod" ? "Cash on Delivery" : "Paid Online"} · {order.paymentStatus}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "security" && (
              <div className="bg-card border border-border/60 rounded-2xl p-6 md:p-8 shadow-sm">
                <SectionHeader icon={Shield} title="Security" subtitle="Change your account password" />
                <form onSubmit={handlePasswordChange} className="space-y-5 max-w-md">
                  <PasswordField
                    label="Current Password"
                    value={currentPassword}
                    onChange={setCurrentPassword}
                    show={showCurrent}
                    onToggle={() => setShowCurrent(!showCurrent)}
                    required
                  />
                  <PasswordField
                    label="New Password"
                    value={newPassword}
                    onChange={setNewPassword}
                    show={showNew}
                    onToggle={() => setShowNew(!showNew)}
                    required
                  />
                  <PasswordField
                    label="Confirm New Password"
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    show={showNew}
                    onToggle={() => setShowNew(!showNew)}
                    required
                  />
                  {passwordError && (
                    <p className="text-xs text-destructive font-body bg-destructive/5 border border-destructive/20 rounded-lg px-3 py-2">
                      {passwordError}
                    </p>
                  )}
                  {confirmPassword && newPassword !== confirmPassword && !passwordError && (
                    <p className="text-xs text-destructive">Passwords do not match</p>
                  )}
                  <p className="text-[11px] text-muted-foreground font-body">
                    Use at least 8 characters with letters and numbers for a strong password.
                  </p>
                  <SaveButton
                    loading={passwordSaving}
                    label="Update Password"
                    disabled={
                      !currentPassword.trim() ||
                      !newPassword.trim() ||
                      newPassword !== confirmPassword ||
                      newPassword.length < 8
                    }
                  />
                </form>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const SectionHeader = ({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: typeof User;
  title: string;
  subtitle: string;
}) => (
  <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border/50">
    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
      <Icon className="w-5 h-5 text-primary" />
    </div>
    <div>
      <h2 className="font-display text-xl font-medium text-foreground">{title}</h2>
      <p className="text-xs text-muted-foreground font-body mt-0.5">{subtitle}</p>
    </div>
  </div>
);

const SaveButton = ({
  loading,
  label,
  disabled,
}: {
  loading: boolean;
  label: string;
  disabled?: boolean;
}) => (
  <button
    type="submit"
    disabled={loading || disabled}
    className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-body text-sm font-medium hover:bg-primary/90 disabled:opacity-60"
  >
    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
    {label}
  </button>
);

export default AccountPage;
