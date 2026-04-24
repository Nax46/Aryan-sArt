import { useScrollFadeIn } from "@/hooks/useScrollFadeIn";

const posts = [
  { title: "The Craft Behind 3D-Printed Decor", category: "Process", color: "hsl(36, 30%, 75%)" },
  { title: "5 Ways to Style a Minimal Shelf", category: "Styling", color: "hsl(105, 20%, 50%)" },
  { title: "Why We Choose Earth Tones", category: "Design", color: "hsl(14, 45%, 55%)" },
];

const Journal = () => {
  const ref = useScrollFadeIn();

  return (
    <section id="journal" className="py-16 sm:py-24 px-4" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-body tracking-[0.3em] uppercase text-muted-foreground mb-2">Stories</p>
          <h2 className="text-3xl sm:text-4xl font-display font-light text-foreground">
            From the Journal
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
          {/* Tall card */}
          <div className="md:row-span-2 group cursor-pointer">
            <div className="relative aspect-[3/4] md:h-full rounded-sm overflow-hidden mb-3 md:mb-0" style={{ backgroundColor: posts[0].color }}>
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-ink/70 to-transparent">
                <p className="text-xs text-parchment/70 font-body uppercase tracking-wider mb-1">{posts[0].category}</p>
                <h3 className="text-xl font-display font-medium text-parchment">{posts[0].title}</h3>
              </div>
            </div>
          </div>
          {/* 2 stacked */}
          {posts.slice(1).map((post) => (
            <div key={post.title} className="group cursor-pointer">
              <div className="relative aspect-[4/3] rounded-sm overflow-hidden mb-3" style={{ backgroundColor: post.color }}>
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-500" />
              </div>
              <p className="text-xs text-muted-foreground font-body uppercase tracking-wider mb-1">{post.category}</p>
              <h3 className="text-lg font-display font-medium text-foreground">{post.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Journal;
