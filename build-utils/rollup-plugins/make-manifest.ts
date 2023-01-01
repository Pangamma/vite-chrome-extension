import * as fs from "fs";
import * as path from "path";
import colorLog from "../log";
import { PluginOption } from "vite";

const { resolve } = path;

// The public folder will be copied to the dist folder by vite.
// const outDir = resolve(__dirname, "..", "..", "src", "public");
// const outDir = resolve(__dirname, "..", "..", "dist");
const outDir = resolve(__dirname, "..", "..", "src", "copied-to-dist-on-compile");

export default function makeManifest(
  manifest: chrome.runtime.ManifestV3
): PluginOption {
  return {
    name: "make-manifest",
    buildEnd() {
      if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir);
      }

      const manifestPath = resolve(outDir, "manifest.json");

      fs.writeFileSync(
        manifestPath,
        JSON.stringify(manifest, null, 2)
      );

      colorLog(`Manifest file copy complete: ${manifestPath}`, "success");
    },
  };
}
