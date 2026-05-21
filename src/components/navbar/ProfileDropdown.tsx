import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LogIn,
  LogOut,
  Package,
  Settings,
  User,
  UserPlus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ProfileDropdownProps {
  className?: string;
  scrolled?: boolean;
}

const ProfileDropdown = ({ className, scrolled }: ProfileDropdownProps) => {
  const { user, logout, isAuthenticated, openAuthModal } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger
          className={`group flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7E1E1E]/20 ${scrolled ? "text-[#F9F7F5]/85 hover:text-[#FFFCFA] hover:bg-white/10" : "text-[#7E1E1E]/80 hover:text-[#7E1E1E] hover:bg-[#7E1E1E]/5"} ${className ?? ""}`}
          aria-label="Account menu"
        >
          <User className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-52 font-body bg-white/95 backdrop-blur-md border-[#7E1E1E]/10 rounded-xl p-1.5 shadow-[0_12px_40px_rgba(62,24,24,0.12)]"
        >
          <DropdownMenuLabel className="font-display text-[#7E1E1E] px-2 py-1.5">
            Welcome
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-[#7E1E1E]/5" />
          <DropdownMenuItem
            className="cursor-pointer text-[#7E1E1E]/80 focus:bg-[#7E1E1E]/5 focus:text-[#7E1E1E] rounded-lg"
            onClick={() => openAuthModal("login")}
          >
            <LogIn className="mr-2 h-4 w-4" />
            <span>Login</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer text-[#7E1E1E]/80 focus:bg-[#7E1E1E]/5 focus:text-[#7E1E1E] rounded-lg"
            onClick={() => openAuthModal("signup")}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            <span>Register</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={`group flex items-center gap-2 text-[#7E1E1E] hover:opacity-90 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7E1E1E]/20 rounded-full ${className ?? ""}`}
      >
        <Avatar className="w-8 h-8 sm:w-9 sm:h-9 border border-[#7E1E1E]/20 transition-transform duration-300 group-hover:scale-105">
          <AvatarImage src={user?.profile?.avatar} />
          <AvatarFallback className="bg-[#7E1E1E] text-white text-xs">
            {user?.name?.substring(0, 2).toUpperCase() || "OC"}
          </AvatarFallback>
        </Avatar>
        <span className="hidden xl:inline font-medium max-w-[100px] truncate font-body text-sm">
          {user?.name?.split(" ")[0]}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 font-body bg-white/95 backdrop-blur-md border-[#7E1E1E]/10 rounded-xl p-1.5 shadow-[0_12px_40px_rgba(62,24,24,0.12)]"
      >
        <DropdownMenuLabel className="font-display font-semibold text-[#7E1E1E] px-2 py-1.5">
          My Account
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-[#7E1E1E]/5" />
        <DropdownMenuItem
          className="cursor-pointer text-[#7E1E1E]/80 focus:bg-[#7E1E1E]/5 focus:text-[#7E1E1E] rounded-lg"
          onClick={() => navigate("/account?tab=orders")}
        >
          <Package className="mr-2 h-4 w-4" />
          <span>My Orders</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer text-[#7E1E1E]/80 focus:bg-[#7E1E1E]/5 focus:text-[#7E1E1E] rounded-lg"
          onClick={() => navigate("/profile")}
        >
          <User className="mr-2 h-4 w-4" />
          <span>My Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer text-[#7E1E1E]/80 focus:bg-[#7E1E1E]/5 focus:text-[#7E1E1E] rounded-lg"
          onClick={() => navigate("/account")}
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>Account Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-[#7E1E1E]/5" />
        <DropdownMenuItem
          className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50 rounded-lg"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;
