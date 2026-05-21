import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PageMeta } from "@/config/pageRegistry";

interface BreadcrumbsProps {
  items: PageMeta["breadcrumbs"];
  className?: string;
}

const Breadcrumbs = ({ items, className }: BreadcrumbsProps) => {
  if (items.length <= 1) return null;

  return (
    <nav aria-label="Breadcrumb" className={cn("mb-6 sm:mb-8", className)}>
      <ol className="flex flex-wrap items-center gap-1 text-xs sm:text-sm font-body text-[#7E1E1E]/55">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1">
              {index > 0 && (
                <ChevronRight className="w-3.5 h-3.5 text-[#7E1E1E]/30 shrink-0" aria-hidden />
              )}
              {item.path && !isLast ? (
                <Link
                  to={item.path}
                  className="hover:text-[#7E1E1E] transition-colors duration-200 inline-flex items-center gap-1"
                >
                  {index === 0 && <Home className="w-3.5 h-3.5" />}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <span
                  className={cn(
                    "inline-flex items-center gap-1",
                    isLast && "text-[#7E1E1E] font-medium",
                  )}
                  aria-current={isLast ? "page" : undefined}
                >
                  {index === 0 && !item.path && <Home className="w-3.5 h-3.5" />}
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
