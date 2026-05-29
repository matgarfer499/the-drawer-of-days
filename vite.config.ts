/// <reference types="vitest/config" />
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Vite 8 resolves tsconfig `paths` natively — no plugin needed.
  resolve: { tsconfigPaths: true },
  test: {
    environment: "happy-dom",
    css: false,
    coverage: { provider: "v8", include: ["src/**/*.{ts,tsx}"] },
  },
});
