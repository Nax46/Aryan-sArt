import { useParams, Link } from "react-router-dom";
import { products } from "@/lib/data";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useScrollFadeIn } from "@/hooks/useScrollFadeIn";

const CategoryPage = () => {
  const { id } = useParams();
  const fadeIn = useScrollFadeIn();

  // Filter products by category
  // Maps category id to actual category names in data.ts
  const categoryMap: Record<string, string> = {
    "lamps": "Lamps",
    "painting": "Painting",
    "decor": "Decor & Objects",
    "temples": "Temples"
  };

  const actualCategory = id ? categoryMap[id.toLowerCase()] || id : "";

  const filteredProducts = products.filter(
    (p) => p.category.toLowerCase() === actualCategory.toLowerCase()
  );

  const categoryName = actualCategory || (id ? id.charAt(0).toUpperCase() + id.slice(1) : "Collection");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12" ref={fadeIn}>
            <nav className="flex mb-4 text-xs font-body tracking-widest uppercase text-muted-foreground">
              <Link to="/" className="hover:text-primary">Home</Link>
              <span className="mx-2">/</span>
              <span>{categoryName}</span>
            </nav>
            <h1 className="text-4xl sm:text-5xl font-display font-light text-foreground mb-4">
              {categoryName}
            </h1>
            <p className="text-muted-foreground font-body max-w-2xl">
              Explore our curated selection of hand-crafted {categoryName.toLowerCase()} made with precision and traditional artistry.
            </p>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <p className="text-muted-foreground font-body">No products found in this category yet.</p>
              <Link to="/" className="mt-4 inline-block text-primary border-b border-primary pb-1 font-body text-sm uppercase tracking-wider">
                Go back to Home
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CategoryPage;
