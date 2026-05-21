import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import SiteLayout from "@/components/layout/SiteLayout";
import Index from "@/pages/Index";
import ProductPage from "@/pages/Product";
import CategoryPage from "@/pages/CategoryPage";
import BlogPage from "@/pages/Blog/index";
import AccountPage from "@/pages/Account";
import NotFound from "@/pages/NotFound";
import { PLACEHOLDER_ROUTES } from "./placeholderRoutes";

const PageFallback = () => (
  <div className="flex items-center justify-center min-h-[40vh]">
    <div className="w-8 h-8 rounded-full border-2 border-[#7E1E1E]/20 border-t-[#7E1E1E] animate-spin" />
  </div>
);

const AppRoutes = () => (
  <Routes>
    {/* Landing — keeps original full homepage layout */}
    <Route path="/" element={<Index />} />

    {/* Legacy / product routes — unchanged */}
    <Route path="/product/:id" element={<ProductPage />} />
    <Route path="/category/:id" element={<CategoryPage />} />
    <Route path="/account" element={<AccountPage />} />

    {/* Site shell with navbar, footer, transitions */}
    <Route element={<SiteLayout />}>
      <Route path="/blog" element={<BlogPage />} />
      {PLACEHOLDER_ROUTES.map(({ path, Component }) => (
        <Route
          key={path}
          path={path}
          element={
            <Suspense fallback={<PageFallback />}>
              <Component />
            </Suspense>
          }
        />
      ))}
    </Route>

    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
