import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path, { resolve } from "path";
import manifest from "./src/manifest";
import makeManifest from "./build-utils/rollup-plugins/make-manifest";

const root = resolve(__dirname, "src");
const pagesDir = resolve(root, "pages");
const assetsDir = resolve(root, "assets");
const outDir = resolve(__dirname, "dist");
const publicDir = resolve(__dirname, "src", "copied-to-dist-on-compile");

const isDev = process.env.__DEV__ === "true";
const isProduction = !isDev;

export default defineConfig({
  resolve: {
    alias: {
      "@src": root,
      "@assets": path.resolve(root, "assets"),
      "@pages": path.resolve(root, "pages"),
      "@utils": path.resolve(root, "utils")
    },
  },
  plugins: [
    react(),
    makeManifest(manifest),
  ],
  publicDir,
  build: {
    outDir,
    assetsDir,
    /** Can slowDown build speed. */
    // sourcemap: isDev,
    minify: isProduction,
    reportCompressedSize: isProduction,
    
    rollupOptions: {
      input: {
        index: path.resolve(root, "pages", "index.html"),
        devtools: resolve(pagesDir, "devtools", "index.html"),
        panel: resolve(pagesDir, "panel", "index.html"),
        content: resolve(pagesDir, "content", "index.ts"),
        background: resolve(pagesDir, "background", "index.ts"),
        contentStyle: resolve(pagesDir, "content", "style.scss"),
        popup: resolve(pagesDir, "popup", "index.html"),
        "deployment-watcher": resolve(pagesDir, "deployment-watcher", "index.html"),
        newtab: resolve(pagesDir, "newtab", "index.html"),
        options: resolve(pagesDir, "options", "index.html"),
      },
      watch: {
        include: ["src/**", "vite.config.ts"],
        exclude: ["node_modules/**", "src/**/*.spec.ts"],
      },
      output: {
        entryFileNames: "src/pages/[name]/index.js",
        chunkFileNames: "assets/js/[name].js",
        assetFileNames: (assetInfo) => {
          const { dir, name: _name } = path.parse(assetInfo.name);
          const assetFolder = dir.split("/").at(-1);
          const name = assetFolder + _name.toLowerCase();
          return `assets/[ext]/${name}.chunk.[ext]`;
        },
      },
    },
  },
});

function firstUpperCase(str: string) {
  const firstAlphabet = new RegExp(/( |^)[a-z]/, "g");
  return str.toLowerCase().replace(firstAlphabet, (L) => L.toUpperCase());
}
