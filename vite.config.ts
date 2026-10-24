/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// On GitHub Pages the app lives under /<repo>/, the deploy workflow passes it in BASE_PATH.
const base = process.env.BASE_PATH ? process.env.BASE_PATH.replace(/\/?$/, "/") : "/";

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icon.svg", "apple-touch-icon.png"],
      manifest: {
        name: "Zdajko – nauka na prawo jazdy",
        short_name: "Zdajko",
        description: "Ucz się do egzaminu teoretycznego na prawo jazdy, przesuwając karty: w prawo TAK, w lewo NIE.",
        lang: "pl",
        theme_color: "#1b1d21",
        background_color: "#1b1d21",
        display: "standalone",
        orientation: "portrait",
        icons: [
          { src: "icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
        ]
      }
    })
  ],
  test: { environment: "node" }
});
