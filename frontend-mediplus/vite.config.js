import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import nodePolyfills from "rollup-plugin-node-polyfills";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    global: "globalThis", // important pour randombytes
    "process.env": {}, // ✅ évite "process is not defined"
    "process.nextTick": "((fn, ...args) => setTimeout(() => fn(...args), 0))", // Polyfill pour process.nextTick
    "process.browser": true,
  },
  resolve: {
    alias: {
      util: "util/",
      events: "events/",
    },
  },
  build: {
    rollupOptions: {
      plugins: [nodePolyfills()],
    },
  },
});
