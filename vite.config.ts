import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr"; // ✅ svgr import 추가
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    svgr(), // ✅ svgr 플러그인 추가
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    port: 5173,
  },
});
