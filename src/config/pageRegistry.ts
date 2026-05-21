import { flattenNavPaths } from "./navigation";

export interface PageMeta {
  path: string;
  title: string;
  heading: string;
  description: string;
  breadcrumbs: { label: string; path?: string }[];
}

const SITE = "OnCanvas";

function pathToSegments(path: string): string[] {
  return path.split("/").filter(Boolean);
}

function segmentToLabel(segment: string): string {
  return segment
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function buildBreadcrumbs(path: string, pageLabel: string): PageMeta["breadcrumbs"] {
  const crumbs: PageMeta["breadcrumbs"] = [{ label: "Home", path: "/" }];
  const segments = pathToSegments(path);

  if (segments.length === 0) return crumbs;

  const section = segments[0];
  const sectionLabels: Record<string, string> = {
    home: "Home",
    categories: "Categories",
    collections: "Collections",
    rooms: "Rooms",
    "custom-design": "Custom Design",
    contact: "Contact",
    blog: "Blog",
    wishlist: "Wishlist",
    cart: "Cart",
    profile: "Profile",
  };

  const sectionLabel = sectionLabels[section] ?? segmentToLabel(section);
  const sectionPath =
    section === "home"
      ? "/"
      : segments.length > 1
        ? `/${section}`
        : path;

  if (section !== "home" || segments.length > 1) {
    crumbs.push({
      label: sectionLabel,
      path: segments.length > 1 ? `/${section}` : undefined,
    });
  }

  let acc = "";
  for (let i = 1; i < segments.length; i++) {
    acc += `/${segments[i]}`;
    const isLast = i === segments.length - 1;
    crumbs.push({
      label: isLast ? pageLabel : segmentToLabel(segments[i]),
      path: isLast ? undefined : `/${section}${acc}`,
    });
  }

  if (segments.length === 1 && section !== "home") {
    crumbs[crumbs.length - 1] = { label: pageLabel };
  }

  return crumbs;
}

function buildMeta(path: string, label: string, description?: string): PageMeta {
  const heading = label;
  const title = `${label} | ${SITE}`;
  return {
    path,
    title,
    heading,
    description:
      description ??
      `Explore ${label.toLowerCase()} — premium handcrafted wooden decor from OnCanvas.`,
    breadcrumbs: buildBreadcrumbs(path, label),
  };
}

const registry = new Map<string, PageMeta>();

flattenNavPaths().forEach(({ label, path, description }) => {
  registry.set(path, buildMeta(path, label, description));
});

/** Section landing pages */
[
  ["/categories", "All Categories", "Browse our full range of wooden decor categories."],
  ["/collections", "Collections", "Curated wooden collections for every style."],
  ["/rooms", "Shop by Room", "Find the perfect wooden piece for every space."],
  ["/custom-design", "Custom Design", "Bespoke wooden art crafted to your vision."],
  ["/contact", "Contact", "We're here to help with orders, support, and custom requests."],
].forEach(([path, label, desc]) => {
  if (!registry.has(path)) registry.set(path, buildMeta(path, label, desc));
});

registry.set(
  "/blog",
  buildMeta("/blog", "Blog", "Stories, guides, and inspiration from OnCanvas."),
);

export function getPageMeta(path: string): PageMeta {
  return (
    registry.get(path) ?? {
      path,
      title: `${SITE}`,
      heading: "Page",
      description: "Premium wooden decor from OnCanvas.",
      breadcrumbs: [{ label: "Home", path: "/" }],
    }
  );
}

export function getAllRegisteredPaths(): string[] {
  return Array.from(registry.keys());
}

export { registry as PAGE_REGISTRY };
