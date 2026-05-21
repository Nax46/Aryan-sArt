import { Link, useLocation } from "react-router-dom";
import { TOP_NAV } from "@/config/navigation";
import MegaMenu from "./MegaMenu";
import { cn } from "@/lib/utils";

interface DesktopMenuProps {
  scrolled?: boolean;
}

const DesktopMenu = ({ scrolled }: DesktopMenuProps) => {
  const location = useLocation();

  return (
    <nav
      className="hidden lg:flex items-center justify-center gap-0.5 flex-1 min-w-0 overflow-visible"
      aria-label="Main navigation"
    >
      {TOP_NAV.map((item) => {
        const isActive =
          item.path === "/"
            ? location.pathname === "/"
            : item.path
              ? location.pathname === item.path ||
                location.pathname.startsWith(`${item.path}/`)
              : false;

        if (item.id === "home") {
          return (
            <MegaMenu key={item.id} item={item} isActive={isActive || location.pathname.startsWith("/home")} scrolled={scrolled} />
          );
        }

        return <MegaMenu key={item.id} item={item} isActive={isActive} scrolled={scrolled} />;
      })}
    </nav>
  );
};

export default DesktopMenu;
