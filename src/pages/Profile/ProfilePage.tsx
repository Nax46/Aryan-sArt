import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  User,
  Package,
  Heart,
  Settings,
  Palette,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
} from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import { getPageMeta } from "@/config/pageRegistry";
import { MOCK_PROFILE, MOCK_ORDERS, MOCK_SAVED_DESIGNS } from "@/lib/mockProfile";
import { cn } from "@/lib/utils";

const meta = getPageMeta("/profile");

type Tab = "overview" | "orders" | "designs" | "wishlist" | "settings";

const TABS: { id: Tab; label: string; icon: typeof User }[] = [
  { id: "overview", label: "Overview", icon: User },
  { id: "orders", label: "My Orders", icon: Package },
  { id: "designs", label: "Saved Designs", icon: Palette },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "settings", label: "Settings", icon: Settings },
];

const ProfilePage = () => {
  const [tab, setTab] = useState<Tab>("overview");
  const p = MOCK_PROFILE;

  return (
    <PageLayout meta={meta}>
      <div className="grid lg:grid-cols-[280px_1fr] gap-8">
        <motion.aside
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-2xl border border-[#7E1E1E]/10 bg-white p-6 shadow-[0_12px_40px_rgba(62,24,24,0.06)] h-fit lg:sticky lg:top-[calc(var(--site-header-height,5.5rem)+1.5rem)]"
        >
          <div className="flex flex-col items-center text-center mb-6">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-[#7E1E1E]/15 mb-4">
              <img src={p.avatar} alt={p.name} className="w-full h-full object-cover" />
            </div>
            <h2 className="font-display text-xl font-bold text-[#7E1E1E] italic">{p.name}</h2>
            <p className="text-xs text-[#7E1E1E]/50 font-body mt-1">Member since {p.memberSince}</p>
          </div>
          <div className="space-y-3 text-sm font-body text-[#4A2511]/75 mb-6">
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#7E1E1E]/40" /> {p.email}
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#7E1E1E]/40" /> {p.mobile}
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#7E1E1E]/40" /> {p.location}
            </p>
          </div>
          <nav className="space-y-1">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-body transition-colors",
                  tab === id
                    ? "bg-[#7E1E1E] text-white"
                    : "text-[#4A2511]/75 hover:bg-[#7E1E1E]/5",
                )}
              >
                <Icon className="w-4 h-4" /> {label}
              </button>
            ))}
          </nav>
        </motion.aside>

        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {tab === "overview" && (
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              {[
                { label: "Orders", value: MOCK_ORDERS.length, href: undefined },
                { label: "Saved Designs", value: MOCK_SAVED_DESIGNS.length, href: undefined },
                { label: "Wishlist", value: "View", href: "/wishlist" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-[#7E1E1E]/10 bg-white p-5 hover:shadow-md transition-shadow"
                >
                  <p className="text-xs uppercase tracking-wider text-[#7E1E1E]/45 font-body">
                    {stat.label}
                  </p>
                  {stat.href ? (
                    <Link to={stat.href} className="font-display text-2xl font-bold text-[#7E1E1E] mt-1">
                      {stat.value} →
                    </Link>
                  ) : (
                    <p className="font-display text-2xl font-bold text-[#7E1E1E] mt-1">{stat.value}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {tab === "orders" && (
            <div className="space-y-4">
              {MOCK_ORDERS.map((order) => (
                <div
                  key={order.id}
                  className="rounded-2xl border border-[#7E1E1E]/10 bg-white p-5 flex flex-wrap items-center justify-between gap-4 hover:border-[#7E1E1E]/20 transition-colors"
                >
                  <div>
                    <p className="font-body font-semibold text-[#4A2511]">{order.id}</p>
                    <p className="text-sm text-[#7E1E1E]/50 font-body mt-1">{order.items}</p>
                    <p className="text-xs text-[#7E1E1E]/40 font-body mt-1">{order.date}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-[#7E1E1E]/10 text-[#7E1E1E]">
                      {order.status}
                    </span>
                    <p className="font-display font-bold text-[#7E1E1E] mt-2">
                      ₹{order.total.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "designs" && (
            <div className="space-y-4">
              {MOCK_SAVED_DESIGNS.map((d) => (
                <div
                  key={d.id}
                  className="rounded-2xl border border-[#7E1E1E]/10 bg-white p-5 flex justify-between items-center"
                >
                  <div>
                    <p className="font-body font-semibold text-[#4A2511]">{d.title}</p>
                    <p className="text-xs text-[#7E1E1E]/50 font-body">{d.date}</p>
                  </div>
                  <span className="text-xs font-bold uppercase text-[#7E1E1E]">{d.status}</span>
                </div>
              ))}
              <Link
                to="/custom-design"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#7E1E1E] font-body hover:gap-3 transition-all"
              >
                New custom request <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {tab === "wishlist" && (
            <div className="rounded-2xl border border-[#7E1E1E]/10 bg-white p-8 text-center">
              <Heart className="w-12 h-12 text-[#7E1E1E]/25 mx-auto mb-4" />
              <p className="font-body text-[#4A2511]/70 mb-4">View and manage your saved products</p>
              <Link
                to="/wishlist"
                className="inline-flex px-6 py-3 rounded-xl bg-[#7E1E1E] text-white font-body font-semibold text-sm"
              >
                Open Wishlist
              </Link>
            </div>
          )}

          {tab === "settings" && (
            <div className="rounded-2xl border border-[#7E1E1E]/10 bg-white p-6 space-y-4">
              {["Edit profile", "Change password", "Notification preferences", "Privacy"].map(
                (item) => (
                  <button
                    key={item}
                    type="button"
                    className="w-full flex items-center justify-between py-3 border-b border-[#7E1E1E]/8 last:border-0 text-left font-body text-sm text-[#4A2511] hover:text-[#7E1E1E]"
                  >
                    {item}
                    <ChevronRight className="w-4 h-4 text-[#7E1E1E]/30" />
                  </button>
                ),
              )}
              <p className="text-xs text-[#7E1E1E]/40 font-body pt-2">
                Settings sync with your account when backend is connected.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </PageLayout>
  );
};

export default ProfilePage;
