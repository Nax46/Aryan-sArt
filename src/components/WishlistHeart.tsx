import { useState, useCallback } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface WishlistHeartProps {
  isWished: boolean;
  onClick: (e: React.MouseEvent) => void;
  size?: "sm" | "md" | "lg";
  className?: string;
  buttonClassName?: string;
}

const sizeMap = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};

const buttonSizeMap = {
  sm: "p-2",
  md: "p-2.5",
  lg: "p-3",
};

const WishlistHeart = ({
  isWished,
  onClick,
  size = "sm",
  className,
  buttonClassName,
}: WishlistHeartProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showRipple, setShowRipple] = useState(false);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsAnimating(true);
      setShowRipple(true);
      onClick(e);
      setTimeout(() => setIsAnimating(false), 600);
      setTimeout(() => setShowRipple(false), 700);
    },
    [onClick]
  );

  return (
    <button
      onClick={handleClick}
      aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
      className={cn(
        "relative group/heart rounded-full transition-all duration-300",
        "bg-white/90 backdrop-blur-md shadow-sm hover:shadow-md hover:bg-white",
        "hover:scale-105 active:scale-95",
        buttonSizeMap[size],
        buttonClassName
      )}
    >
      {/* Ripple rings — Flipkart-style burst */}
      {showRipple && (
        <>
          <span
            className={cn(
              "absolute inset-0 rounded-full pointer-events-none",
              isWished ? "heart-ripple-wished" : "heart-ripple"
            )}
          />
          <span
            className={cn(
              "absolute inset-0 rounded-full pointer-events-none animation-delay-100",
              isWished ? "heart-ripple-wished" : "heart-ripple"
            )}
          />
        </>
      )}

      {/* Glow behind filled heart */}
      {isWished && (
        <span className="absolute inset-0 rounded-full bg-primary/20 blur-sm scale-150 pointer-events-none heart-glow" />
      )}

      <Heart
        className={cn(
          sizeMap[size],
          "relative z-10 transition-all duration-300",
          isWished
            ? "fill-primary text-primary drop-shadow-sm"
            : "text-muted-foreground group-hover/heart:text-primary/70",
          isAnimating && (isWished ? "animate-heart-pop" : "animate-heart-pop"),
          isAnimating && isWished && "animate-heart-fill",
          !isWished && isAnimating && "animate-heart-bounce",
          className
        )}
      />

      {/* Sparkle particles on add */}
      {isAnimating && !isWished && (
        <>
          <span className="absolute -top-0.5 -right-0.5 w-1 h-1 bg-primary rounded-full animate-sparkle-1 pointer-events-none" />
          <span className="absolute -top-1 left-1/2 w-0.5 h-0.5 bg-accent rounded-full animate-sparkle-2 pointer-events-none" />
          <span className="absolute top-1/2 -right-1 w-0.5 h-0.5 bg-primary/70 rounded-full animate-sparkle-3 pointer-events-none" />
        </>
      )}
    </button>
  );
};

export default WishlistHeart;
