import { useState } from "react";
import { ChevronDown, Heart, Package, Settings, User, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  TOP_NAV,
  type TopNavItem,
  type NavGroup,
  type NavLeaf,
} from "@/config/navigation";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

const AccordionSection = ({
  title,
  open,
  onToggle,
  children,
  depth = 0,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  depth?: number;
}) => (
  <div className={cn(depth > 0 && "ml-3 border-l border-[#7E1E1E]/8")}>
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "flex items-center justify-between w-full py-2.5 pr-4 text-left font-body transition-colors",
        depth === 0 ? "text-[#7E1E1E] font-medium pl-4" : "text-[#7E1E1E]/85 text-sm pl-6",
      )}
      aria-expanded={open}
    >
      <span>{title}</span>
      <ChevronDown
        className={cn(
          "w-4 h-4 text-[#7E1E1E]/45 mr-2 transition-transform duration-300",
          open && "rotate-180",
        )}
      />
    </button>
    <div
      className={cn(
        "overflow-hidden transition-all duration-300 ease-out",
        open ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0",
      )}
    >
      <div className="pb-2">{children}</div>
    </div>
  </div>
);

const MobileLeaf = ({ link, onClose, depth }: { link: NavLeaf; onClose: () => void; depth: number }) => (
  <Link
    to={link.path}
    onClick={onClose}
    className={cn(
      "block py-2 pr-4 text-sm text-[#7E1E1E]/75 hover:text-[#7E1E1E] hover:bg-[#7E1E1E]/5 rounded-lg transition-colors font-body",
      depth === 0 ? "pl-8" : depth === 1 ? "pl-10" : "pl-12",
    )}
  >
    {link.label}
  </Link>
);

const MobileCategoryGroup = ({
  group,
  onClose,
}: {
  group: NavGroup;
  onClose: () => void;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <AccordionSection title={group.label} open={open} onToggle={() => setOpen((v) => !v)} depth={1}>
      <Link
        to={group.path}
        onClick={onClose}
        className="block py-2 pl-10 pr-4 text-xs uppercase tracking-wider text-[#7E1E1E]/45 hover:text-[#7E1E1E] font-body"
      >
        View all {group.label}
      </Link>
      {group.children.map((child) => (
        <MobileLeaf key={child.path} link={child} onClose={onClose} depth={2} />
      ))}
    </AccordionSection>
  );
};

const MobileNavSection = ({ item, onClose }: { item: TopNavItem; onClose: () => void }) => {
  const [open, setOpen] = useState(false);

  if (item.id === "home" && item.homeLinks) {
    return (
      <AccordionSection title={item.label} open={open} onToggle={() => setOpen((v) => !v)}>
        <Link to="/" onClick={onClose} className="block py-2 pl-8 text-sm text-[#7E1E1E]/60 font-body">
          Homepage
        </Link>
        {item.homeLinks.map((link) => (
          <MobileLeaf key={link.path} link={link} onClose={onClose} depth={0} />
        ))}
      </AccordionSection>
    );
  }

  if (item.variant === "columns" && item.groups) {
    return (
      <AccordionSection title={item.label} open={open} onToggle={() => setOpen((v) => !v)}>
        {item.path && (
          <Link
            to={item.path}
            onClick={onClose}
            className="block py-2 pl-8 text-xs uppercase tracking-wider text-[#7E1E1E]/45 font-body"
          >
            All Categories
          </Link>
        )}
        {item.groups.map((group) => (
          <MobileCategoryGroup key={group.path} group={group} onClose={onClose} />
        ))}
      </AccordionSection>
    );
  }

  const links = item.links ?? item.homeLinks ?? [];
  if (links.length === 0 && item.path) {
    return (
      <Link
        to={item.path}
        onClick={onClose}
        className="flex items-center w-full py-3 pl-4 pr-4 text-[#7E1E1E] font-medium font-body border-b border-[#7E1E1E]/5"
      >
        {item.label}
      </Link>
    );
  }

  return (
    <AccordionSection title={item.label} open={open} onToggle={() => setOpen((v) => !v)}>
      {item.path && item.id !== "blog" && (
        <Link
          to={item.path}
          onClick={onClose}
          className="block py-2 pl-8 text-xs uppercase tracking-wider text-[#7E1E1E]/45 font-body"
        >
          View all
        </Link>
      )}
      {links.map((link) => (
        <MobileLeaf key={link.path} link={link} onClose={onClose} depth={0} />
      ))}
    </AccordionSection>
  );
};

const MobileMenu = ({ open, onClose }: MobileMenuProps) => {
  const { isAuthenticated, openAuthModal } = useAuth();
  const { totalItemCount, setIsOpen: setWishlistOpen } = useWishlist();
  const navigate = useNavigate();

  if (!open) return null;

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-[60] bg-[#1a1010]/30 backdrop-blur-[2px] lg:hidden animate-in fade-in duration-200"
        onClick={onClose}
        aria-label="Close menu"
      />

      <div
        className={cn(
          "fixed top-0 right-0 z-[70] h-full w-[min(100%,340px)] bg-white/98 backdrop-blur-xl",
          "border-l border-[#7E1E1E]/10 shadow-[-8px_0_40px_rgba(62,24,24,0.12)]",
          "lg:hidden flex flex-col animate-slide-in-right",
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-[#7E1E1E]/10">
          <span className="font-display text-lg font-bold text-[#7E1E1E] italic">Menu</span>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-[#7E1E1E] hover:bg-[#7E1E1E]/5 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {TOP_NAV.map((item) => (
            <div key={item.id} className="border-b border-[#7E1E1E]/5 last:border-0">
              <MobileNavSection item={item} onClose={onClose} />
            </div>
          ))}

          <div className="mt-4 px-4 space-y-1 border-t border-[#7E1E1E]/10 pt-4">
            <Link
              to="/home/new-arrivals"
              onClick={onClose}
              className="flex items-center py-2.5 text-sm text-[#7E1E1E]/80 hover:text-[#7E1E1E] font-body"
            >
              New Arrivals
            </Link>
            <Link
              to="/wishlist"
              onClick={onClose}
              className="flex items-center gap-2 py-2.5 text-sm text-[#7E1E1E]/80 hover:text-[#7E1E1E] font-body"
            >
              <Heart className="w-4 h-4" /> Wishlist
              {totalItemCount > 0 && (
                <span className="ml-auto bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {totalItemCount}
                </span>
              )}
            </Link>
            <Link
              to="/cart"
              onClick={onClose}
              className="flex items-center py-2.5 text-sm text-[#7E1E1E]/80 font-body"
            >
              Cart
            </Link>
            <Link
              to="/profile"
              onClick={onClose}
              className="flex items-center gap-2 py-2.5 text-sm text-[#7E1E1E]/80 font-body"
            >
              <User className="w-4 h-4" /> Profile
            </Link>
            {isAuthenticated ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    navigate("/account?tab=orders");
                    onClose();
                  }}
                  className="flex items-center gap-2 w-full py-2.5 text-sm text-[#7E1E1E]/80 font-body"
                >
                  <Package className="w-4 h-4" /> My Orders
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigate("/account?tab=profile");
                    onClose();
                  }}
                  className="flex items-center gap-2 w-full py-2.5 text-sm text-[#7E1E1E]/80 font-body"
                >
                  <Settings className="w-4 h-4" /> Settings
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    openAuthModal("login");
                    onClose();
                  }}
                  className="w-full py-2.5 text-sm text-[#7E1E1E] font-medium font-body text-left"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => {
                    openAuthModal("signup");
                    onClose();
                  }}
                  className="w-full py-2.5 text-sm text-[#7E1E1E]/80 font-body text-left"
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
