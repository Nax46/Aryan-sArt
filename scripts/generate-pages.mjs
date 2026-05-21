import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..", "src", "pages");

function toPascal(segment) {
  return segment
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");
}

function pathToComponentPath(routePath) {
  const segments = routePath.split("/").filter(Boolean);
  if (segments.length === 0) return null;
  const section = segments[0];
  const sectionFolder =
    section === "custom-design"
      ? "CustomDesign"
      : section.charAt(0).toUpperCase() + section.slice(1);

  if (segments.length === 1) {
    return path.join(sectionFolder, "index.tsx");
  }

  const rest = segments.slice(1).map(toPascal);
  if (rest.length === 1) {
    return path.join(sectionFolder, `${rest[0]}.tsx`);
  }
  return path.join(sectionFolder, ...rest.slice(0, -1), `${rest[rest.length - 1]}.tsx`);
}

const paths = [
  "/home/featured-products",
  "/home/trending",
  "/home/new-arrivals",
  "/home/best-sellers",
  "/home/recommended",
  "/categories",
  "/categories/wooden-wall-art",
  "/categories/wooden-wall-art/nature-design",
  "/categories/wooden-wall-art/abstract-design",
  "/categories/wooden-wall-art/quotes-design",
  "/categories/wooden-wall-art/religious-design",
  "/categories/wooden-wall-art/personalized-design",
  "/categories/wooden-lamps",
  "/categories/wooden-lamps/table-lamps",
  "/categories/wooden-lamps/hanging-lamps",
  "/categories/wooden-lamps/night-lamps",
  "/categories/wooden-lamps/led-lamps",
  "/categories/wooden-lamps/designer-lamps",
  "/categories/home-decor",
  "/categories/home-decor/wall-decor",
  "/categories/home-decor/shelves",
  "/categories/home-decor/decorative-pieces",
  "/categories/home-decor/mirrors",
  "/categories/home-decor/frames",
  "/categories/office-decor",
  "/categories/office-decor/desk-organizer",
  "/categories/office-decor/name-plates",
  "/categories/office-decor/office-wall-art",
  "/categories/office-decor/pen-stands",
  "/categories/office-decor/clock-designs",
  "/categories/wooden-clocks",
  "/categories/wooden-clocks/modern",
  "/categories/wooden-clocks/vintage",
  "/categories/wooden-clocks/minimal",
  "/categories/wooden-clocks/custom",
  "/categories/personalized-gifts",
  "/categories/personalized-gifts/name-art",
  "/categories/personalized-gifts/photo-frame",
  "/categories/personalized-gifts/couple-gifts",
  "/categories/personalized-gifts/birthday-gifts",
  "/categories/personalized-gifts/corporate-gifts",
  "/collections",
  "/collections/trending",
  "/collections/premium",
  "/collections/festival",
  "/collections/minimal",
  "/collections/luxury",
  "/collections/best-selling",
  "/rooms",
  "/rooms/living-room",
  "/rooms/bedroom",
  "/rooms/office",
  "/rooms/kitchen",
  "/rooms/study-room",
  "/rooms/workspace",
  "/custom-design",
  "/custom-design/upload-custom-design",
  "/custom-design/personalized-wooden-art",
  "/custom-design/photo-to-wooden-frame",
  "/custom-design/custom-name-board",
  "/custom-design/custom-lamp-design",
  "/contact",
  "/contact/contact-us",
  "/contact/support",
  "/contact/faq",
  "/contact/feedback",
  "/wishlist",
  "/cart",
  "/profile",
];

const template = (routePath) => `import { createPlaceholderPage } from "@/lib/createPlaceholderPage";

export default createPlaceholderPage("${routePath}");
`;

for (const routePath of paths) {
  const rel = pathToComponentPath(routePath);
  if (!rel) continue;
  const full = path.join(root, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, template(routePath));
  console.log("Created", rel);
}

console.log("Done:", paths.length, "pages");
