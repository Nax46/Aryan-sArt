import { useEffect } from "react";

/** Body scroll lock + ESC to close for cart/wishlist drawers */
export function useDrawerLayer(isOpen: boolean, onClose: () => void) {
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);
}
