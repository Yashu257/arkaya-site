/**
 * Standalone Vite config for Vercel deployment.
 * Bypasses the @lovable.dev/vite-tanstack-config wrapper and the
 * @cloudflare/vite-plugin which are incompatible with Vercel's build env.
 * Produces a plain SPA in dist/ with index.html + assets.
 */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

export default defineConfig({
  plugins: [
    TanStackRouterVite({ autoCodeSplitting: true }),
    react(),
    tailwindcss(),
    tsconfigPaths(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // base is set to /arkaya-site/ for GitHub Pages
  // For local dev or Vercel (custom domain), set base: "/"
  base: process.env.GITHUB_PAGES ? "/arkaya-site/" : "/",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: "./index.html",
    },
  },
});
