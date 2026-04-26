import { useScrollFadeIn } from "@/hooks/useScrollFadeIn";

const categories = [
  { 
    name: "Lamps", 
    subtitle: "Warm light, sculpted form", 
    image: "/temples/3.jpeg" 
  },
  { 
    name: "Painting", 
    subtitle: "Art that speaks", 
    image: "/temples/5.jpeg" 
  },
  { 
    name: "Decor & Objects", 
    subtitle: "Details that define spaces", 
    image: "/temples/6.jpeg" 
  },
];

const ShopByCategory = () => {
  const ref = useScrollFadeIn();

  return (
    <section className="py-16 sm:py-24 px-4" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-body tracking-[0.3em] uppercase text-muted-foreground mb-2">Browse</p>
          <h2 className="text-3xl sm:text-4xl font-display font-light text-foreground">
            Shop by Category
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="relative aspect-[4/3] rounded-sm flex flex-col justify-end p-6 sm:p-8 cursor-pointer group overflow-hidden"
            >
              {/* Background Image */}
              <img 
                src={cat.image} 
                alt={cat.name} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-500" />
              
              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-2xl sm:text-3xl font-display font-medium text-white">
                  {cat.name}
                </h3>
                <p className="font-body text-sm text-white/80 mt-1">{cat.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByCategory;
