import React, { createContext, useContext, useState, useCallback } from "react";

interface QuickViewContextType {
  productId: string | null;
  openQuickView: (productId: string) => void;
  closeQuickView: () => void;
}

const QuickViewContext = createContext<QuickViewContextType | null>(null);

export const useQuickView = () => {
  const ctx = useContext(QuickViewContext);
  if (!ctx) throw new Error("useQuickView must be used within QuickViewProvider");
  return ctx;
};

export const QuickViewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [productId, setProductId] = useState<string | null>(null);

  const openQuickView = useCallback((id: string) => setProductId(id), []);
  const closeQuickView = useCallback(() => setProductId(null), []);

  return (
    <QuickViewContext.Provider value={{ productId, openQuickView, closeQuickView }}>
      {children}
    </QuickViewContext.Provider>
  );
};
