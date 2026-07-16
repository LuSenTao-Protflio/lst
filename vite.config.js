import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // GitHub Pages serves this repository from /lst/ rather than the domain root.
  // The workflow provides the value, while local development keeps root-relative URLs.
  base: process.env.VITE_BASE_PATH || "/",
  plugins: [react()],
  server: {
    host: "127.0.0.1",
    port: 4173,
    strictPort: false,
  },
  preview: {
    host: "127.0.0.1",
    port: 4173,
    strictPort: false,
  },
});
