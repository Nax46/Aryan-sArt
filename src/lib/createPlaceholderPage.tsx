import PlaceholderPage from "@/components/layout/PlaceholderPage";
import { getPageMeta } from "@/config/pageRegistry";

/** Factory for thin route page modules */
export function createPlaceholderPage(path: string) {
  const Component = () => <PlaceholderPage meta={getPageMeta(path)} />;
  Component.displayName = `Page(${path})`;
  return Component;
}
