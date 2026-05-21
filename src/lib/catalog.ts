import { products as legacyProducts } from "@/lib/data";
import { MOCK_PRODUCTS, type MockProduct, type ProductBadge } from "@/lib/mockProducts";

export type { ProductBadge };

export interface StoreProduct {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  category: string;
  collection?: string;
  badge?: ProductBadge;
  image: string;
  images: string[];
  description: string;
  features: string[];
  inStock: boolean;
  isLegacy?: boolean;
}

export type SortOption =
  | "price-asc"
  | "price-desc"
  | "newest"
  | "popular"
  | "rating";

export interface ProductFilters {
  priceMin?: number;
  priceMax?: number;
  category?: string;
  collection?: string;
  minRating?: number;
  badge?: ProductBadge | "New" | "Trending" | "Best Seller";
}

const mockToStore = (p: MockProduct): StoreProduct => ({
  id: p.id,
  slug: p.slug,
  name: p.name,
  price: p.price,
  originalPrice: p.originalPrice,
  rating: p.rating,
  reviewCount: p.reviewCount,
  category: p.category,
  collection:
    p.badge === "Best Seller"
      ? "Best Selling Collection"
      : p.badge === "Trending"
        ? "Trending Collection"
        : p.badge === "New"
          ? "Minimal Collection"
          : "Premium Collection",
  badge: p.badge,
  image: p.image,
  images: [
    p.image,
    p.image.replace("w=800", "w=600") + "&sat=-20",
    p.image.replace("w=800", "w=600") + "&brightness=0.9",
  ],
  description: p.description,
  features: [
    "Handcrafted in Bundi, Rajasthan",
    "Premium quality wood finish",
    "Precision CNC detailing",
    "Secure packaging for safe delivery",
  ],
  inStock: true,
});

const legacyToStore = (p: (typeof legacyProducts)[0], index: number): StoreProduct => ({
  id: String(p.id),
  slug: `legacy-${p.id}`,
  name: p.name,
  price: p.price,
  originalPrice: Math.round(p.price * 1.15),
  rating: 4.5 + (index % 5) * 0.1,
  reviewCount: 20 + index * 7,
  category: p.category,
  collection: "Premium Collection",
  image:
    p.image ||
    "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=800&q=80",
  images: p.image
    ? [p.image, p.image]
    : [
        "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=800&q=80",
      ],
  description: p.description || "Premium handcrafted piece from OnCanvas.",
  features: ["Made in India", "Quality assured", "Custom options available"],
  inStock: true,
  isLegacy: true,
});

const CATALOG: StoreProduct[] = [
  ...MOCK_PRODUCTS.map(mockToStore),
  ...legacyProducts.slice(0, 12).map(legacyToStore),
];

export const ALL_CATEGORIES = [...new Set(CATALOG.map((p) => p.category))].sort();
export const ALL_COLLECTIONS = [...new Set(CATALOG.map((p) => p.collection).filter(Boolean))] as string[];

export function getAllProducts(): StoreProduct[] {
  return CATALOG;
}

export function getProductById(id: string): StoreProduct | undefined {
  return CATALOG.find((p) => p.id === id || p.slug === id);
}

export function getRelatedProducts(product: StoreProduct, limit = 4): StoreProduct[] {
  return CATALOG.filter((p) => p.id !== product.id && p.category === product.category).slice(0, limit);
}

export function filterAndSortProducts(
  filters: ProductFilters,
  sort: SortOption = "popular",
): StoreProduct[] {
  let list = [...CATALOG];

  if (filters.category) {
    list = list.filter((p) => p.category === filters.category);
  }
  if (filters.collection) {
    list = list.filter((p) => p.collection === filters.collection);
  }
  if (filters.priceMin != null) {
    list = list.filter((p) => p.price >= filters.priceMin!);
  }
  if (filters.priceMax != null) {
    list = list.filter((p) => p.price <= filters.priceMax!);
  }
  if (filters.minRating != null) {
    list = list.filter((p) => p.rating >= filters.minRating!);
  }
  if (filters.badge) {
    list = list.filter((p) => p.badge === filters.badge);
  }

  switch (sort) {
    case "price-asc":
      list.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      list.sort((a, b) => b.price - a.price);
      break;
    case "newest":
      list.sort((a, b) => (a.badge === "New" ? -1 : 1) - (b.badge === "New" ? -1 : 1));
      break;
    case "rating":
      list.sort((a, b) => b.rating - a.rating);
      break;
    case "popular":
    default:
      list.sort((a, b) => b.reviewCount - a.reviewCount);
  }

  return list;
}

export function searchProducts(query: string): StoreProduct[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return CATALOG.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q),
  ).slice(0, 12);
}
