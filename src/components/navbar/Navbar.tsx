import { useEffect, useRef, useState } from "react";
import { Heart, Menu, Search, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";
import ProfileDropdown from "./ProfileDropdown";
import SearchOverlay from "./SearchOverlay";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const { count, setIsOpen: setCartOpen } = useCart();
  const { totalItemCount, setIsOpen: setWishlistOpen } = useWishlist();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const setNavHeight = () => {
      if (navRef.current) {
        document.documentElement.style.setProperty(
          "--nav-height",
          `${navRef.current.offsetHeight}px`,
        );
      }
    };
    setNavHeight();
    window.addEventListener("resize", setNavHeight);
    return () => window.removeEventListener("resize", setNavHeight);
  }, [scrolled]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header
        ref={navRef}
        className={cn(
          "w-full transition-all duration-500 ease-out will-change-[background,box-shadow,padding]",
          scrolled
            ? [
                "bg-[#2a1810]/92 backdrop-blur-xl",
                "shadow-[0_12px_40px_rgba(26,14,8,0.35)]",
                "border-b border-[#E8D5C4]/15",
              ]
            : [
                "bg-[#FFFCFA]/95 backdrop-blur-md",
                "border-b border-[#7E1E1E]/10",
                "shadow-[0_4px_24px_rgba(62,24,24,0.06)]",
              ],
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={cn(
              "flex items-center justify-between gap-4 transition-[height] duration-500 ease-out",
              scrolled ? "h-14 sm:h-[3.75rem]" : "h-16 sm:h-20",
            )}
          >
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex items-center gap-2 sm:gap-3 shrink-0 group text-left"
              aria-label="OnCanvas home"
            >
              <img
                src="/ON_CANVAS_Logo-removebg-preview.png"
                alt=""
                className={cn(
                  "w-auto object-contain transition-all duration-500",
                  scrolled ? "h-9 sm:h-10 brightness-110" : "h-10 sm:h-14",
                )}
              />
              <div className="flex flex-col min-w-0">
                <div className="flex items-baseline gap-1.5">
                  <span
                    className={cn(
                      "text-lg sm:text-2xl font-display font-bold italic leading-none transition-colors duration-300",
                      scrolled
                        ? "text-[#F9F7F5] group-hover:text-[#E8D5C4]"
                        : "text-[#7E1E1E] group-hover:text-[#6a1a1a]",
                    )}
                  >
                    OnCanvas
                  </span>
                  <span
                    className={cn(
                      "font-body text-[10px] hidden xl:inline",
                      scrolled ? "text-[#E8D5C4]/50" : "text-[#7E1E1E]/40",
                    )}
                  >
                    by
                  </span>
                  <span
                    className={cn(
                      "text-[10px] sm:text-sm font-body font-semibold tracking-wide hidden xl:inline",
                      scrolled ? "text-[#E8D5C4]/70" : "text-[#7E1E1E]/70",
                    )}
                  >
                    Aryans Art
                  </span>
                </div>
                <p
                  className={cn(
                    "hidden md:block text-[10px] tracking-[0.2em] font-body uppercase transition-all duration-500",
                    scrolled
                      ? "opacity-0 h-0 overflow-hidden"
                      : "text-[#7E1E1E]/50",
                  )}
                >
                  Crafting memories with precision
                </p>
              </div>
            </button>

            <DesktopMenu scrolled={scrolled} />

            <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className={cn("nav-icon-btn", scrolled && "nav-icon-btn-scrolled")}
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => setWishlistOpen(true)}
                className={cn("nav-icon-btn relative", scrolled && "nav-icon-btn-scrolled")}
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {totalItemCount > 0 && (
                  <span className="nav-badge animate-in zoom-in duration-200">
                    {totalItemCount > 99 ? "99+" : totalItemCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setCartOpen(true)}
                className={cn("nav-icon-btn relative", scrolled && "nav-icon-btn-scrolled")}
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {count > 0 && (
                  <span className="nav-badge bg-[#7E1E1E] text-white">
                    {count > 99 ? "99+" : count}
                  </span>
                )}
              </button>

              <ProfileDropdown scrolled={scrolled} />

              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className={cn(
                  "lg:hidden nav-icon-btn ml-0.5",
                  scrolled && "nav-icon-btn-scrolled",
                )}
                aria-label="Open menu"
                aria-expanded={mobileMenuOpen}
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
};

export default Navbar;
