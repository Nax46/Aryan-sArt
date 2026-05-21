import { useCallback, useEffect, useMemo, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { products, type Product } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

function getRecommendations(currentId: number): Product[] {
  const current = products.find((p) => p.id === currentId);
  const others = products.filter((p) => p.id !== currentId);
  if (!current) return others;

  const sameCategory = others.filter((p) => p.category === current.category);
  const otherCategories = others.filter((p) => p.category !== current.category);
  return [...sameCategory, ...otherCategories];
}

const SCALE_CENTER = 1;
const SCALE_MIN = 0.66;
const OPACITY_CENTER = 1;
const OPACITY_MIN = 0.42;

function getTweenFromDistance(distance: number, containerWidth: number) {
  const normalized = Math.min(distance / (containerWidth * 0.38), 1);
  const factor = 1 - normalized ** 1.35;
  const scale = SCALE_MIN + factor * (SCALE_CENTER - SCALE_MIN);
  const opacity = OPACITY_MIN + factor * (OPACITY_CENTER - OPACITY_MIN);
  return { scale, opacity, factor };
}

interface ProductRecommendationsProps {
  currentProductId: number;
}

const ProductRecommendations = ({ currentProductId }: ProductRecommendationsProps) => {
  const navigate = useNavigate();
  const tweenRaf = useRef<number | null>(null);
  const recommendations = useMemo(
    () => getRecommendations(currentProductId),
    [currentProductId],
  );

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    containScroll: false,
    dragFree: false,
    skipSnaps: false,
  });

  const applyCenterScale = useCallback(() => {
    if (!emblaApi) return;

    const root = emblaApi.rootNode();
    const rootRect = root.getBoundingClientRect();
    const rootCenter = rootRect.left + rootRect.width / 2;

    emblaApi.slideNodes().forEach((slide) => {
      const inner = slide.querySelector<HTMLElement>("[data-reco-inner]");
      if (!inner) return;

      const rect = slide.getBoundingClientRect();
      const slideCenter = rect.left + rect.width / 2;
      const distance = Math.abs(rootCenter - slideCenter);
      const { scale, opacity, factor } = getTweenFromDistance(distance, rootRect.width);

      inner.style.transform = `scale(${scale})`;
      inner.style.opacity = String(opacity);

      const isCenter = factor > 0.82;
      inner.dataset.center = isCenter ? "true" : "false";
      slide.style.zIndex = isCenter ? "20" : String(Math.round(factor * 10));
    });
  }, [emblaApi]);

  const onScroll = useCallback(() => {
    if (tweenRaf.current !== null) cancelAnimationFrame(tweenRaf.current);
    tweenRaf.current = requestAnimationFrame(() => {
      applyCenterScale();
      tweenRaf.current = null;
    });
  }, [applyCenterScale]);

  useEffect(() => {
    if (!emblaApi) return;

    applyCenterScale();
    emblaApi.on("scroll", onScroll);
    emblaApi.on("reInit", applyCenterScale);
    emblaApi.on("resize", applyCenterScale);
    emblaApi.on("select", applyCenterScale);

    return () => {
      emblaApi.off("scroll", onScroll);
      emblaApi.off("reInit", applyCenterScale);
      emblaApi.off("resize", applyCenterScale);
      emblaApi.off("select", applyCenterScale);
    };
  }, [emblaApi, onScroll, applyCenterScale]);

  if (recommendations.length === 0) return null;

  const handleProductClick = (id: number) => {
    navigate(`/product/${id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section
      className="mt-16 lg:mt-20 pt-14 border-t border-border/80"
      aria-label="More products you may like"
    >
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 mb-4">
          <Sparkles className="w-3.5 h-3.5 text-primary/80" />
          <span className="text-[10px] font-body font-medium uppercase tracking-[0.25em] text-primary/90">
            Handpicked for you
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-light text-foreground mb-3">
          You May Also Like
        </h2>
        <p className="text-sm font-body text-muted-foreground max-w-md mx-auto leading-relaxed">
          Swipe gently — the centre piece leads the collection.
        </p>
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div
          ref={emblaRef}
          className="reco-viewport overflow-hidden py-6 sm:py-10"
        >
          <div className="flex touch-pan-y items-center">
            {recommendations.map((item) => (
              <div
                key={item.id}
                className="reco-slide flex-[0_0_52%] sm:flex-[0_0_36%] md:flex-[0_0_28%] lg:flex-[0_0_22%] min-w-0 pl-3 sm:pl-4 flex justify-center items-center"
              >
                <div
                  data-reco-inner
                  data-center="false"
                  className="reco-slide-inner group w-full max-w-[220px] sm:max-w-none mx-auto will-change-transform"
                >
                  <button
                    type="button"
                    onClick={() => handleProductClick(item.id)}
                    className={cn(
                      "reco-card w-full text-left",
                      "flex flex-col rounded-sm overflow-hidden",
                      "border border-border/40 bg-card",
                      "shadow-[0_4px_24px_-8px_hsl(var(--foreground)/0.08)]",
                      "transition-[box-shadow,border-color] duration-500 ease-out",
                      "group-data-[center=true]:border-primary/25",
                      "group-data-[center=true]:shadow-[0_16px_48px_-16px_hsl(var(--primary)/0.22)]",
                      "hover:border-primary/30",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    )}
                    aria-label={`View ${item.name}`}
                  >
                    <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F9F7F5]">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                          loading="lazy"
                          draggable={false}
                        />
                      ) : (
                        <div
                          className="h-full w-full"
                          style={{ backgroundColor: item.color, opacity: 0.5 }}
                        />
                      )}
                      <div
                        className={cn(
                          "absolute inset-0 bg-gradient-to-t from-foreground/50 via-transparent to-transparent",
                          "opacity-0 transition-opacity duration-500",
                          "group-hover:opacity-100 group-data-[center=true]:opacity-0",
                        )}
                      />
                    </div>

                    <div
                      className={cn(
                        "px-3 py-3 sm:py-3.5 text-center border-t border-border/30 bg-card/95",
                        "transition-colors duration-500",
                        "group-data-[center=true]:bg-primary/[0.04]",
                        "group-hover:bg-primary/[0.03]",
                      )}
                    >
                      <h3
                        className={cn(
                          "font-body text-[11px] sm:text-xs font-medium text-muted-foreground leading-snug",
                          "line-clamp-2 transition-all duration-500",
                          "group-data-[center=true]:text-sm group-data-[center=true]:sm:text-[15px]",
                          "group-data-[center=true]:text-foreground group-data-[center=true]:font-medium",
                          "group-hover:text-primary",
                        )}
                      >
                        {item.name}
                      </h3>
                    </div>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => emblaApi?.scrollPrev()}
          className={cn(
            "absolute left-0 top-1/2 -translate-y-1/2 z-30",
            "h-10 w-10 sm:h-11 sm:w-11 rounded-full",
            "border-border/80 bg-background/90 backdrop-blur-sm shadow-md",
            "hover:bg-primary hover:text-primary-foreground hover:border-primary",
            "transition-all duration-300 hover:scale-105",
          )}
          aria-label="Previous products"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => emblaApi?.scrollNext()}
          className={cn(
            "absolute right-0 top-1/2 -translate-y-1/2 z-30",
            "h-10 w-10 sm:h-11 sm:w-11 rounded-full",
            "border-border/80 bg-background/90 backdrop-blur-sm shadow-md",
            "hover:bg-primary hover:text-primary-foreground hover:border-primary",
            "transition-all duration-300 hover:scale-105",
          )}
          aria-label="Next products"
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      <p className="mt-4 text-center text-[10px] font-body uppercase tracking-[0.24em] text-muted-foreground/80">
        Drag or tap arrows · Centre highlights the focus piece
      </p>
    </section>
  );
};

export default ProductRecommendations;
