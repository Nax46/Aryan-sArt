import { Search, Heart, ShoppingBag, User, Package, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { useState } from "react";

const Navbar = () => {
  const { count, setIsOpen } = useCart();
  const { user, logout, setIsAuthModalOpen } = useAuth();
  const { items: wishlistItems, setIsOpen: setWishlistOpen } = useWishlist();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
              <div className="flex items-baseline gap-2">
                <h1 className="text-2xl sm:text-3xl font-display font-bold text-primary italic leading-none">
                  Canvas
                </h1>
                <span className="text-muted-foreground/50 font-body text-sm hidden sm:inline">by</span>
                <span className="text-sm sm:text-base font-body font-semibold text-foreground/70 tracking-wide hidden sm:inline">Aryans Art</span>
              </div>
              <p className="text-[10px] sm:text-xs tracking-[0.2em] text-muted-foreground font-body uppercase">
                Crafting memories with precision
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search for lamps, planters..."
                onFocus={() => setSearchOpen(true)}
                onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-sm bg-transparent text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30"
              />
              {searchOpen && (
                <div className="absolute top-full left-0 w-full mt-1 bg-background border border-border rounded-sm shadow-sm p-4 z-50">
                  <p className="text-sm text-muted-foreground">Type to search items...</p>
                </div>
              )}
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-4 sm:gap-6 font-body text-sm">
            <a href="#arrivals" className="hidden sm:block text-foreground hover:text-primary transition-colors">
              Shop
            </a>
            {user ? (
               <DropdownMenu>
                 <DropdownMenuTrigger className="hidden sm:flex items-center gap-1 text-foreground hover:text-primary transition-colors focus:outline-none">
                   <User className="w-4 h-4"/> <span className="truncate max-w-[80px] font-medium">{user.user_metadata?.full_name?.split(" ")[0] || "Profile"}</span>
                 </DropdownMenuTrigger>
                 <DropdownMenuContent align="end" className="w-56 font-body bg-white rounded-sm">
                   <DropdownMenuLabel className="font-medium text-foreground">My Account</DropdownMenuLabel>
                   <DropdownMenuSeparator />
                   <DropdownMenuItem className="cursor-pointer text-foreground focus:bg-primary/5 focus:text-primary">
                     <User className="mr-2 h-4 w-4" />
                     <span>My Profile</span>
                   </DropdownMenuItem>
                   <DropdownMenuItem className="cursor-pointer text-foreground focus:bg-primary/5 focus:text-primary">
                     <Package className="mr-2 h-4 w-4" />
                     <span>Orders</span>
                   </DropdownMenuItem>
                   <DropdownMenuItem className="cursor-pointer text-foreground focus:bg-primary/5 focus:text-primary" onClick={() => setWishlistOpen(true)}>
                     <Heart className="mr-2 h-4 w-4" />
                     <span>Wishlist</span>
                   </DropdownMenuItem>
                   <DropdownMenuSeparator />
                   <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50" onClick={logout}>
                     <LogOut className="mr-2 h-4 w-4" />
                     <span>Logout</span>
                   </DropdownMenuItem>
                 </DropdownMenuContent>
               </DropdownMenu>
            ) : (
               <button onClick={() => setIsAuthModalOpen(true)} className="hidden sm:flex items-center gap-1 text-foreground hover:text-primary transition-colors">
                 <User className="w-4 h-4"/> Log In
               </button>
            )}
            <button 
              onClick={() => setWishlistOpen(true)}
              className="relative text-foreground hover:text-primary transition-colors"
            >
              <Heart className="w-5 h-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] font-medium w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsOpen(true)}
              className="relative text-foreground hover:text-primary transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] font-medium w-4 h-4 rounded-full flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
