import type { ReactNode } from "react";
import Breadcrumbs from "./Breadcrumbs";
import { usePageTitle } from "./usePageTitle";
import type { PageMeta } from "@/config/pageRegistry";
import { cn } from "@/lib/utils";

interface PageLayoutProps {
  meta: PageMeta;
  children?: ReactNode;
  className?: string;
}

const PageLayout = ({ meta, children, className }: PageLayoutProps) => {
  usePageTitle(meta.title);

  return (
    <article className={cn("min-h-[50vh]", className)}>
      <Breadcrumbs items={meta.breadcrumbs} />
      <header className="mb-8 sm:mb-10">
        <p className="text-[10px] sm:text-xs tracking-[0.25em] uppercase text-[#7E1E1E]/45 font-body mb-2">
          OnCanvas — Handcrafted Wooden Art
        </p>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#7E1E1E] italic leading-tight">
          {meta.heading}
        </h1>
        <p className="mt-3 max-w-2xl text-sm sm:text-base text-[#4A2511]/70 font-body leading-relaxed">
          {meta.description}
        </p>
      </header>
      {children}
    </article>
  );
};

export default PageLayout;
