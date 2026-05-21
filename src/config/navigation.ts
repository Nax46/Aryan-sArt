/** Central navigation tree — single source for mega menus, mobile accordion, and routes */

export interface NavLeaf {
  label: string;
  path: string;
  description?: string;
}

export interface NavGroup {
  label: string;
  path: string;
  description?: string;
  children: NavLeaf[];
}

export interface NavSection {
  label: string;
  path: string;
  description?: string;
}

export type MegaMenuVariant = "home" | "columns" | "grid" | "links";

export interface TopNavItem {
  id: string;
  label: string;
  path?: string;
  variant: MegaMenuVariant;
  /** Simple link list (collections, rooms, custom, contact) */
  links?: NavLeaf[];
  /** Multi-group columns (categories) */
  groups?: NavGroup[];
  /** Home featured links */
  homeLinks?: NavLeaf[];
}

export const ROUTES = {
  home: "/",
  wishlist: "/wishlist",
  cart: "/cart",
  profile: "/profile",
  blog: "/blog",
  account: "/account",
} as const;

const home = (slug: string) => `/home/${slug}`;
const category = (parent: string, child?: string) =>
  child ? `/categories/${parent}/${child}` : `/categories/${parent}`;
const collection = (slug: string) => `/collections/${slug}`;
const room = (slug: string) => `/rooms/${slug}`;
const custom = (slug: string) => `/custom-design/${slug}`;
const contact = (slug: string) => `/contact/${slug}`;

export const HOME_LINKS: NavLeaf[] = [
  { label: "Featured Products", path: home("featured-products"), description: "Handpicked wooden masterpieces" },
  { label: "Trending", path: home("trending"), description: "What collectors love right now" },
  { label: "New Arrivals", path: home("new-arrivals"), description: "Fresh from our workshop" },
  { label: "Best Sellers", path: home("best-sellers"), description: "Our most loved pieces" },
  { label: "Recommended", path: home("recommended"), description: "Curated for your space" },
];

export const CATEGORY_GROUPS: NavGroup[] = [
  {
    label: "Wooden Wall Art",
    path: category("wooden-wall-art"),
    description: "Statement pieces for every wall",
    children: [
      { label: "Nature Design", path: category("wooden-wall-art", "nature-design") },
      { label: "Abstract Design", path: category("wooden-wall-art", "abstract-design") },
      { label: "Quotes Design", path: category("wooden-wall-art", "quotes-design") },
      { label: "Religious Design", path: category("wooden-wall-art", "religious-design") },
      { label: "Personalized Design", path: category("wooden-wall-art", "personalized-design") },
    ],
  },
  {
    label: "Wooden Lamps",
    path: category("wooden-lamps"),
    description: "Warm ambient handcrafted lighting",
    children: [
      { label: "Table Lamps", path: category("wooden-lamps", "table-lamps") },
      { label: "Hanging Lamps", path: category("wooden-lamps", "hanging-lamps") },
      { label: "Night Lamps", path: category("wooden-lamps", "night-lamps") },
      { label: "LED Lamps", path: category("wooden-lamps", "led-lamps") },
      { label: "Designer Lamps", path: category("wooden-lamps", "designer-lamps") },
    ],
  },
  {
    label: "Home Decor",
    path: category("home-decor"),
    description: "Elevate every corner of home",
    children: [
      { label: "Wall Decor", path: category("home-decor", "wall-decor") },
      { label: "Shelves", path: category("home-decor", "shelves") },
      { label: "Decorative Pieces", path: category("home-decor", "decorative-pieces") },
      { label: "Mirrors", path: category("home-decor", "mirrors") },
      { label: "Frames", path: category("home-decor", "frames") },
    ],
  },
  {
    label: "Office Decor",
    path: category("office-decor"),
    description: "Professional wooden accents",
    children: [
      { label: "Desk Organizer", path: category("office-decor", "desk-organizer") },
      { label: "Name Plates", path: category("office-decor", "name-plates") },
      { label: "Office Wall Art", path: category("office-decor", "office-wall-art") },
      { label: "Pen Stands", path: category("office-decor", "pen-stands") },
      { label: "Clock Designs", path: category("office-decor", "clock-designs") },
    ],
  },
  {
    label: "Wooden Clocks",
    path: category("wooden-clocks"),
    description: "Timeless craftsmanship",
    children: [
      { label: "Modern", path: category("wooden-clocks", "modern") },
      { label: "Vintage", path: category("wooden-clocks", "vintage") },
      { label: "Minimal", path: category("wooden-clocks", "minimal") },
      { label: "Custom", path: category("wooden-clocks", "custom") },
    ],
  },
  {
    label: "Personalized Gifts",
    path: category("personalized-gifts"),
    description: "Meaningful bespoke creations",
    children: [
      { label: "Name Art", path: category("personalized-gifts", "name-art") },
      { label: "Photo Frame", path: category("personalized-gifts", "photo-frame") },
      { label: "Couple Gifts", path: category("personalized-gifts", "couple-gifts") },
      { label: "Birthday Gifts", path: category("personalized-gifts", "birthday-gifts") },
      { label: "Corporate Gifts", path: category("personalized-gifts", "corporate-gifts") },
    ],
  },
];

export const COLLECTION_LINKS: NavLeaf[] = [
  { label: "Trending Collection", path: collection("trending"), description: "Popular picks this season" },
  { label: "Premium Collection", path: collection("premium"), description: "Luxury wooden artistry" },
  { label: "Festival Collection", path: collection("festival"), description: "Celebrate with handcrafted decor" },
  { label: "Minimal Collection", path: collection("minimal"), description: "Clean lines, quiet elegance" },
  { label: "Luxury Collection", path: collection("luxury"), description: "Opulent statement pieces" },
  { label: "Best Selling Collection", path: collection("best-selling"), description: "Customer favorites" },
];

export const ROOM_LINKS: NavLeaf[] = [
  { label: "Living Room", path: room("living-room") },
  { label: "Bedroom", path: room("bedroom") },
  { label: "Office", path: room("office") },
  { label: "Kitchen", path: room("kitchen") },
  { label: "Study Room", path: room("study-room") },
  { label: "Workspace", path: room("workspace") },
];

export const CUSTOM_DESIGN_LINKS: NavLeaf[] = [
  { label: "Upload Custom Design", path: custom("upload-custom-design") },
  { label: "Personalized Wooden Art", path: custom("personalized-wooden-art") },
  { label: "Photo To Wooden Frame", path: custom("photo-to-wooden-frame") },
  { label: "Custom Name Board", path: custom("custom-name-board") },
  { label: "Custom Lamp Design", path: custom("custom-lamp-design") },
];

export const CONTACT_LINKS: NavLeaf[] = [
  { label: "Contact Us", path: contact("contact-us") },
  { label: "Support", path: contact("support") },
  { label: "FAQ", path: contact("faq") },
  { label: "Feedback", path: contact("feedback") },
];

export const BLOG_LINKS: NavLeaf[] = [
  { label: "All Articles", path: ROUTES.blog, description: "Stories, guides & inspiration" },
];

export const TOP_NAV: TopNavItem[] = [
  { id: "home", label: "Home", path: ROUTES.home, variant: "home", homeLinks: HOME_LINKS },
  { id: "categories", label: "Categories", path: "/categories", variant: "columns", groups: CATEGORY_GROUPS },
  { id: "collections", label: "Collections", path: "/collections", variant: "grid", links: COLLECTION_LINKS },
  { id: "rooms", label: "Rooms", path: "/rooms", variant: "grid", links: ROOM_LINKS },
  { id: "custom-design", label: "Custom Design", path: "/custom-design", variant: "links", links: CUSTOM_DESIGN_LINKS },
  { id: "blog", label: "Blog", path: ROUTES.blog, variant: "links", links: BLOG_LINKS },
  { id: "contact", label: "Contact", path: "/contact", variant: "links", links: CONTACT_LINKS },
];

/** Flatten all navigable paths for route registration */
export function flattenNavPaths(): NavLeaf[] {
  const paths: NavLeaf[] = [];

  const add = (label: string, path: string, description?: string) => {
    if (!paths.some((p) => p.path === path)) paths.push({ label, path, description });
  };

  HOME_LINKS.forEach((l) => add(l.label, l.path, l.description));
  add("Categories", "/categories", "Explore wooden decor categories");
  CATEGORY_GROUPS.forEach((g) => {
    add(g.label, g.path, g.description);
    g.children.forEach((c) => add(c.label, c.path));
  });
  add("Collections", "/collections");
  COLLECTION_LINKS.forEach((l) => add(l.label, l.path, l.description));
  add("Rooms", "/rooms");
  ROOM_LINKS.forEach((l) => add(l.label, l.path));
  add("Custom Design", "/custom-design");
  CUSTOM_DESIGN_LINKS.forEach((l) => add(l.label, l.path));
  BLOG_LINKS.forEach((l) => add(l.label, l.path, l.description));
  add("Contact", "/contact");
  CONTACT_LINKS.forEach((l) => add(l.label, l.path));

  add("Wishlist", ROUTES.wishlist);
  add("Cart", ROUTES.cart);
  add("Profile", ROUTES.profile);

  return paths;
}
