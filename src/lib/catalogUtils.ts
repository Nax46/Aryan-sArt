import type { StoreProduct } from "@/lib/catalog";
import type { MockProduct } from "@/lib/mockProducts";

/** Bridge StoreProduct → MockProduct for shared ProductCard */
export function mockProductFromStore(p: StoreProduct): MockProduct {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: p.price,
    originalPrice: p.originalPrice,
    rating: p.rating,
    reviewCount: p.reviewCount,
    category: p.category,
    badge: p.badge,
    image: p.image,
    description: p.description,
  };
}
