/** Mock catalog for homepage UI — no backend */

export type ProductBadge = "New" | "Trending" | "Best Seller" | "Limited Edition";

export interface MockProduct {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  category: string;
  badge?: ProductBadge;
  image: string;
  description: string;
}

export const MOCK_PRODUCTS: MockProduct[] = [
  {
    id: "mp-1",
    slug: "wooden-mountain-wall-art",
    name: "Wooden Mountain Wall Art",
    price: 4299,
    originalPrice: 5499,
    rating: 4.9,
    reviewCount: 128,
    category: "Wooden Wall Art",
    badge: "Best Seller",
    image: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=800&q=80",
    description: "Layered walnut silhouette mountainscape for serene living spaces.",
  },
  {
    id: "mp-2",
    slug: "minimal-wooden-clock",
    name: "Minimal Wooden Clock",
    price: 2899,
    originalPrice: 3499,
    rating: 4.8,
    reviewCount: 94,
    category: "Wooden Clocks",
    badge: "Trending",
    image: "https://images.unsplash.com/photo-1563861826100-9cb518e86a24?auto=format&fit=crop&w=800&q=80",
    description: "Clean geometric dial in hand-finished teak with silent movement.",
  },
  {
    id: "mp-3",
    slug: "led-moon-lamp",
    name: "LED Moon Lamp",
    price: 3199,
    originalPrice: 3999,
    rating: 4.7,
    reviewCount: 210,
    category: "Wooden Lamps",
    badge: "New",
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80",
    description: "Warm ambient moon lamp with carved wooden base and dimmer.",
  },
  {
    id: "mp-4",
    slug: "luxury-office-name-plate",
    name: "Luxury Office Name Plate",
    price: 1899,
    originalPrice: 2299,
    rating: 4.9,
    reviewCount: 67,
    category: "Office Decor",
    badge: "Limited Edition",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    description: "Engraved executive name plate in rich mahogany tone finish.",
  },
  {
    id: "mp-5",
    slug: "personalized-wooden-frame",
    name: "Personalized Wooden Frame",
    price: 2499,
    rating: 4.8,
    reviewCount: 156,
    category: "Personalized Gifts",
    badge: "Trending",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
    description: "Custom engraved frame for memories that deserve craftsmanship.",
  },
  {
    id: "mp-6",
    slug: "wooden-shelf-decor",
    name: "Wooden Shelf Decor",
    price: 3599,
    originalPrice: 4299,
    rating: 4.6,
    reviewCount: 43,
    category: "Home Decor",
    badge: "New",
    image: "https://images.unsplash.com/photo-1616486338812-3d58e0e9e0c3?auto=format&fit=crop&w=800&q=80",
    description: "Floating hex shelf set with natural grain highlight.",
  },
  {
    id: "mp-7",
    slug: "nature-theme-wall-design",
    name: "Nature Theme Wall Design",
    price: 4999,
    originalPrice: 5999,
    rating: 4.9,
    reviewCount: 88,
    category: "Wooden Wall Art",
    badge: "Best Seller",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80",
    description: "Botanical forest panel with precision CNC botanical detailing.",
  },
  {
    id: "mp-8",
    slug: "designer-hanging-lamp",
    name: "Designer Hanging Lamp",
    price: 5499,
    originalPrice: 6499,
    rating: 4.7,
    reviewCount: 72,
    category: "Wooden Lamps",
    badge: "Limited Edition",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
    description: "Sculptural pendant in bent oak strips with brass accents.",
  },
  {
    id: "mp-9",
    slug: "wooden-quote-art",
    name: "Wooden Quote Art",
    price: 2799,
    rating: 4.5,
    reviewCount: 39,
    category: "Wooden Wall Art",
    image: "https://images.unsplash.com/photo-1452860606248-08befadbe6f8?auto=format&fit=crop&w=800&q=80",
    description: "Inspirational quote plaque in laser-etched premium plywood.",
  },
  {
    id: "mp-10",
    slug: "custom-couple-gift",
    name: "Custom Couple Gift",
    price: 3299,
    originalPrice: 3899,
    rating: 4.9,
    reviewCount: 201,
    category: "Personalized Gifts",
    badge: "Trending",
    image: "https://images.unsplash.com/photo-1518199266791-5375a575a556?auto=format&fit=crop&w=800&q=80",
    description: "Interlocking hearts design with names — perfect for anniversaries.",
  },
  {
    id: "mp-11",
    slug: "office-desk-organizer",
    name: "Office Desk Organizer",
    price: 2199,
    rating: 4.6,
    reviewCount: 55,
    category: "Office Decor",
    badge: "New",
    image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=80",
    description: "Modular desk caddy with pen slots and phone stand.",
  },
  {
    id: "mp-12",
    slug: "premium-wooden-mirror",
    name: "Premium Wooden Mirror",
    price: 6899,
    originalPrice: 7999,
    rating: 4.8,
    reviewCount: 31,
    category: "Home Decor",
    badge: "Best Seller",
    image: "https://images.unsplash.com/photo-1618221197210-5fe695e511c2?auto=format&fit=crop&w=800&q=80",
    description: "Arched full-length mirror framed in solid sheesham wood.",
  },
];

export const getFeaturedProducts = () => MOCK_PRODUCTS;
export const getTrendingProducts = () =>
  MOCK_PRODUCTS.filter((p) => p.badge === "Trending" || p.badge === "Best Seller").slice(0, 8);
export const getNewArrivals = () => MOCK_PRODUCTS.filter((p) => p.badge === "New").concat(MOCK_PRODUCTS.slice(0, 4)).slice(0, 8);
export const getBestSellers = () =>
  MOCK_PRODUCTS.filter((p) => p.badge === "Best Seller").concat(MOCK_PRODUCTS).slice(0, 8);
