// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import type { Plugin } from "vite";

// Inject CSP header via a dev-server middleware plugin.
// Three.js / WebGL shader compilation requires 'unsafe-eval' at runtime.
// Using a plugin avoids the @lovable.dev wrapper stripping server.headers.
function cspHeaderPlugin(): Plugin {
  return {
    name: "csp-header",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use((_req, res, next) => {
        res.setHeader(
          "Content-Security-Policy",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https: blob:; worker-src blob:; object-src 'none';"
        );
        next();
      });
    },
  };
}

// Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
// @cloudflare/vite-plugin builds from this — wrangler.jsonc main alone is insufficient.
export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    plugins: [cspHeaderPlugin()],
  },
});
