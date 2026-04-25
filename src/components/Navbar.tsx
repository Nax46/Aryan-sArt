import { Search, Heart, ShoppingBag, User, Package, LogOut, LogIn } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { useState } from "react";

const Navbar = () => {
  const { count, setIsOpen } = useCart();
  const { user, logout, setIsAuthModalOpen, isAuthenticated } = useAuth();
  const { items: wishlistItems, setIsOpen: setWishlistOpen } = useWishlist();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#8B4513]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <div className="flex items-baseline gap-2">
                <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#8B4513] italic leading-none">
                  Canvas
                </h1>
                <span className="text-[#8B4513]/40 font-body text-sm hidden sm:inline">by</span>
                <span className="text-sm sm:text-base font-body font-semibold text-[#8B4513]/70 tracking-wide hidden sm:inline">Aryans Art</span>
              </div>
              <p className="text-[10px] sm:text-xs tracking-[0.2em] text-[#8B4513]/50 font-body uppercase">
                Crafting memories with precision
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B4513]/40" />
              <input
                type="text"
                placeholder="Search for lamps, planters..."
                onFocus={() => setSearchOpen(true)}
                onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
                className="w-full pl-10 pr-4 py-2 border border-[#8B4513]/20 rounded-lg bg-transparent text-sm font-body placeholder:text-[#8B4513]/30 focus:outline-none focus:ring-1 focus:ring-[#8B4513]/30"
              />
              {searchOpen && (
                <div className="absolute top-full left-0 w-full mt-1 bg-white border border-[#8B4513]/10 rounded-lg shadow-lg p-4 z-50">
                  <p className="text-sm text-[#8B4513]/50">Type to search items...</p>
                </div>
              )}
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-4 sm:gap-6 font-body text-sm">
            <a href="#arrivals" className="hidden sm:block text-[#8B4513]/80 hover:text-[#8B4513] transition-colors font-medium">
              Shop
            </a>
            
            {isAuthenticated ? (
               <DropdownMenu>
                 <DropdownMenuTrigger className="flex items-center gap-2 text-[#8B4513] hover:opacity-80 transition-all focus:outline-none">
                   <Avatar className="w-8 h-8 border border-[#8B4513]/20">
                     <AvatarImage src={user?.profile?.avatar} />
                     <AvatarFallback className="bg-[#8B4513] text-white text-xs">
                       {user?.name?.substring(0, 2).toUpperCase() || "CN"}
                     </AvatarFallback>
                   </Avatar>
                   <span className="hidden lg:inline font-medium max-w-[100px] truncate">
                     {user?.name?.split(" ")[0]}
                   </span>
                 </DropdownMenuTrigger>
                 <DropdownMenuContent align="end" className="w-56 font-body bg-white border-[#8B4513]/10 rounded-lg p-1">
                   <DropdownMenuLabel className="font-semibold text-[#8B4513] px-2 py-1.5">My Account</DropdownMenuLabel>
                   <DropdownMenuSeparator className="bg-[#8B4513]/5" />
                   <DropdownMenuItem className="cursor-pointer text-[#8B4513]/80 focus:bg-[#8B4513]/5 focus:text-[#8B4513] rounded-md">
                     <User className="mr-2 h-4 w-4" />
                     <span>My Profile</span>
                   </DropdownMenuItem>
                   <DropdownMenuItem className="cursor-pointer text-[#8B4513]/80 focus:bg-[#8B4513]/5 focus:text-[#8B4513] rounded-md">
                     <Package className="mr-2 h-4 w-4" />
                     <span>Orders</span>
                   </DropdownMenuItem>
                   <DropdownMenuItem className="cursor-pointer text-[#8B4513]/80 focus:bg-[#8B4513]/5 focus:text-[#8B4513] rounded-md" onClick={() => setWishlistOpen(true)}>
                     <Heart className="mr-2 h-4 w-4" />
                     <span>Wishlist</span>
                   </DropdownMenuItem>
                   <DropdownMenuSeparator className="bg-[#8B4513]/5" />
                   <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50 rounded-md" onClick={logout}>
                     <LogOut className="mr-2 h-4 w-4" />
                     <span>Logout</span>
                   </DropdownMenuItem>
                 </DropdownMenuContent>
               </DropdownMenu>
            ) : (
               <button 
                onClick={() => setIsAuthModalOpen(true)} 
                className="flex items-center gap-2 bg-[#8B4513] text-white px-4 py-2 rounded-lg hover:bg-[#8B4513]/90 transition-all shadow-sm font-medium"
               >
                 <LogIn className="w-4 h-4"/> Log In
               </button>
            )}

            <button 
              onClick={() => setWishlistOpen(true)}
              className="relative text-[#8B4513]/80 hover:text-[#8B4513] transition-colors"
            >
              <Heart className="w-5 h-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsOpen(true)}
              className="relative text-[#8B4513]/80 hover:text-[#8B4513] transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#8B4513] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
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
