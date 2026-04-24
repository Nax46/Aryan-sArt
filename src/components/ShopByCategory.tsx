import { useScrollFadeIn } from "@/hooks/useScrollFadeIn";

const categories = [
  { name: "Lamps", subtitle: "Warm light, sculpted form", gradient: "from-[hsl(36,30%,72%)] to-[hsl(37,40%,60%)]" },
  { name: "Planters", subtitle: "Green meets geometry", gradient: "from-[hsl(105,21%,45%)] to-[hsl(105,25%,35%)]" },
  { name: "Decor & Objects", subtitle: "Details that define spaces", gradient: "from-[hsl(14,40%,55%)] to-[hsl(0,40%,40%)]" },
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
              className={`relative aspect-[4/3] rounded-sm bg-gradient-to-br ${cat.gradient} flex flex-col justify-end p-6 sm:p-8 cursor-pointer group overflow-hidden`}
            >
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-500" />
              <div className="relative">
                <h3 className="text-2xl sm:text-3xl font-display font-medium text-parchment">
                  {cat.name}
                </h3>
                <p className="font-body text-sm text-parchment/80 mt-1">{cat.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByCategory;
