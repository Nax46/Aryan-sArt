import { useState } from "react";

import { Link } from "react-router-dom";

import { motion, AnimatePresence } from "framer-motion";

import { ArrowRight, ChevronDown } from "lucide-react";

import type { TopNavItem, NavGroup, NavLeaf } from "@/config/navigation";

import { cn } from "@/lib/utils";



interface MegaMenuProps {

  item: TopNavItem;

  isActive?: boolean;

  scrolled?: boolean;

}



const panelVariants = {

  hidden: { opacity: 0, y: -8, scale: 0.97 },

  visible: {

    opacity: 1,

    y: 0,

    scale: 1,

    transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },

  },

  exit: {

    opacity: 0,

    y: -6,

    scale: 0.98,

    transition: { duration: 0.22, ease: [0.4, 0, 1, 1] },

  },

};



const MegaLinkCard = ({

  link,

  compact,

}: {

  link: NavLeaf;

  compact?: boolean;

}) => (

  <Link

    to={link.path}

    className={cn(

      "group block rounded-xl border border-[#E8D5C4]/12",

      "bg-[#FFFCFA]/[0.06] backdrop-blur-sm",

      "p-3.5 sm:p-4 transition-all duration-300",

      "hover:border-[#C9A87C]/35 hover:bg-[#FFFCFA]/[0.12]",

      "hover:shadow-[0_0_24px_rgba(201,168,124,0.15)] hover:-translate-y-0.5",

    )}

  >

    <span className="flex items-center justify-between gap-2">

      <span

        className={cn(

          "font-body font-medium text-[#F9F7F5] group-hover:text-[#E8D5C4] transition-colors",

          compact ? "text-sm" : "text-sm sm:text-base",

        )}

      >

        {link.label}

      </span>

      <ArrowRight className="w-3.5 h-3.5 text-[#E8D5C4]/40 group-hover:text-[#E8D5C4] group-hover:translate-x-0.5 transition-all shrink-0" />

    </span>

    {link.description && !compact && (

      <p className="mt-1.5 text-[11px] text-[#E8D5C4]/55 font-body leading-snug line-clamp-2">

        {link.description}

      </p>

    )}

  </Link>

);



const CategoryColumn = ({ group }: { group: NavGroup }) => (

  <div className="min-w-0 py-1">

    <Link

      to={group.path}

      className="font-display text-base font-semibold text-[#E8D5C4] italic hover:text-[#FFFCFA] transition-colors mb-1.5 block"

    >

      {group.label}

    </Link>

    {group.description && (

      <p className="text-[10px] text-[#E8D5C4]/45 font-body mb-4 tracking-wide leading-relaxed">

        {group.description}

      </p>

    )}

    <ul className="space-y-1">

      {group.children.map((child) => (

        <li key={child.path}>

          <Link

            to={child.path}

            className="text-sm font-body text-[#F9F7F5]/70 hover:text-[#FFFCFA] hover:pl-1.5 transition-all duration-200 py-1.5 block rounded-md hover:bg-white/[0.04]"

          >

            {child.label}

          </Link>

        </li>

      ))}

    </ul>

  </div>

);



const MegaMenuPanel = ({ item }: { item: TopNavItem }) => {

  if (item.variant === "home" && item.homeLinks) {

    return (

      <div className="p-6 sm:p-8">

        <Link

          to="/"

          className="inline-flex items-center gap-2 text-xs font-body uppercase tracking-[0.2em] text-[#E8D5C4]/55 hover:text-[#E8D5C4] mb-5 transition-colors"

        >

          Visit Homepage <ArrowRight className="w-3.5 h-3.5" />

        </Link>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">

          {item.homeLinks.map((link) => (

            <MegaLinkCard key={link.path} link={link} />

          ))}

        </div>

      </div>

    );

  }



  if (item.variant === "columns" && item.groups) {

    return (

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-x-6 gap-y-8 p-6 sm:p-8 lg:p-10">

        {item.groups.map((group) => (

          <CategoryColumn key={group.path} group={group} />

        ))}

      </div>

    );

  }



  const links = item.links ?? [];

  const cols =

    item.variant === "grid"

      ? "grid-cols-2 sm:grid-cols-3"

      : "grid-cols-1 sm:grid-cols-2";



  return (

    <div className={cn("grid gap-3 sm:gap-4 p-6 sm:p-8", cols)}>

      {links.map((link) => (

        <MegaLinkCard key={link.path} link={link} compact={item.variant === "links"} />

      ))}

    </div>

  );

};



const MegaMenu = ({ item, isActive, scrolled }: MegaMenuProps) => {

  const [open, setOpen] = useState(false);

  const hasPanel =

    item.variant === "home" ||

    (item.groups && item.groups.length > 0) ||

    (item.links && item.links.length > 0);



  if (!hasPanel && item.path) {

    return (

      <Link

        to={item.path}

        className={cn(

          "nav-link-premium px-3 py-2 text-sm font-medium font-body transition-colors duration-300",

          scrolled
            ? isActive
              ? "text-[#E8D5C4]"
              : "text-[#F9F7F5]/85 hover:text-[#FFFCFA]"
            : isActive
              ? "text-[#7E1E1E]"
              : "text-[#7E1E1E]/80 hover:text-[#7E1E1E]",

        )}

      >

        {item.label}

      </Link>

    );

  }



  return (

    <div

      className="relative shrink-0"

      onMouseEnter={() => setOpen(true)}

      onMouseLeave={() => setOpen(false)}

    >

      <button

        type="button"

        className={cn(

          "nav-link-premium flex items-center gap-1 px-3 py-2 text-sm font-medium font-body transition-colors duration-300 whitespace-nowrap",

          scrolled
            ? open || isActive
              ? "text-[#E8D5C4]"
              : "text-[#F9F7F5]/85 hover:text-[#FFFCFA]"
            : open || isActive
              ? "text-[#7E1E1E]"
              : "text-[#7E1E1E]/80 hover:text-[#7E1E1E]",

        )}

        aria-haspopup="true"

        aria-expanded={open}

      >

        {item.label}

        <ChevronDown

          className={cn(

            "w-3.5 h-3.5 opacity-60 transition-transform duration-300",

            open && "rotate-180",

          )}

        />

      </button>



      <AnimatePresence>

        {open && (

          <motion.div

            variants={panelVariants}

            initial="hidden"

            animate="visible"

            exit="exit"

            className="fixed left-0 right-0 z-[80] px-4 sm:px-6 lg:px-8 pointer-events-none"

            style={{ top: "var(--site-header-height, 5.5rem)" }}

          >

            <div className="max-w-7xl mx-auto pointer-events-auto">

              <div className="mega-menu-panel overflow-hidden">

                {item.path && item.variant !== "home" && (

                  <div className="px-6 sm:px-8 pt-5 pb-0 flex items-center border-b border-[#E8D5C4]/10">

                    <Link

                      to={item.path}

                      className="text-xs font-body uppercase tracking-[0.2em] text-[#E8D5C4]/55 hover:text-[#E8D5C4] transition-colors py-2"

                    >

                      View all {item.label}

                    </Link>

                  </div>

                )}

                <MegaMenuPanel item={item} />

              </div>

            </div>

          </motion.div>

        )}

      </AnimatePresence>

    </div>

  );

};



export default MegaMenu;

