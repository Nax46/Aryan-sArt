import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function toPascal(segment) {
  return segment
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");
}

function pathToImport(routePath) {
  const segments = routePath.split("/").filter(Boolean);
  const section = segments[0];
  const sectionFolder =
    section === "custom-design"
      ? "CustomDesign"
      : section.charAt(0).toUpperCase() + section.slice(1);

  if (segments.length === 1) {
    return `@/pages/${sectionFolder}`;
  }
  const rest = segments.slice(1).map(toPascal);
  if (rest.length === 1) {
    return `@/pages/${sectionFolder}/${rest[0]}`;
  }
  return `@/pages/${sectionFolder}/${rest.slice(0, -1).join("/")}/${rest[rest.length - 1]}`;
}

const paths = fs
  .readFileSync(path.join(__dirname, "generate-pages.mjs"), "utf8")
  .match(/"(\/[^"]+)"/g)
  .map((s) => s.slice(1, -1));

const lines = paths.map((p) => {
  const imp = pathToImport(p);
  const name = "Page_" + p.replace(/\//g, "_").replace(/-/g, "_").replace(/^_/, "");
  return `const ${name} = lazy(() => import("${imp}"));`;
});

const routes = paths.map((p) => {
  const name = "Page_" + p.replace(/\//g, "_").replace(/-/g, "_").replace(/^_/, "");
  return `  { path: "${p}", Component: ${name} },`;
});

const out = `/* Auto-generated — run: node scripts/generate-routes.mjs */
import { lazy } from "react";

${lines.join("\n")}

export const PLACEHOLDER_ROUTES = [
${routes.join("\n")}
] as const;
`;

const routesDir = path.join(__dirname, "..", "src", "routes");
fs.mkdirSync(routesDir, { recursive: true });
fs.writeFileSync(path.join(routesDir, "placeholderRoutes.tsx"), out);
console.log("Generated placeholderRoutes.tsx with", paths.length, "routes");
