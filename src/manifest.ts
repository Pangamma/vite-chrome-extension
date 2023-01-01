import packageJson from "../package.json" assert { type: 'json' };

const manifest: chrome.runtime.ManifestV3 = {
  "$schema": "https://json.schemastore.org/chrome-manifest",
  manifest_version: 3,
  name: packageJson.name,
  version: packageJson.version,
  description: packageJson.description,
//   options_page: "src/pages/options/index.html",
  // background: { service_worker: "src/pages/background/index.js" },
  action: {
    default_popup: "src/pages/popup/index.html",
    default_icon: { 24: "icon-34.png" },
  },
//   chrome_url_overrides: {
//     newtab: "src/pages/newtab/index.html",
//   },
  icons: { 128: "icon-128.png" },
//   content_scripts: [
//     {
//       matches: ["http://*/*", "https://*/*", "<all_urls>"],
//       js: ["src/pages/content/index.js"],
//       css: ["assets/css/contentStyle.chunk.css"],
//     },
//   ],
//   devtools_page: "src/pages/devtools/index.html",
  web_accessible_resources: [
    {
      resources: [
        "assets/js/*.js",
        "assets/css/*.css",
        "assets/png/*.png",
        "assets/jpeg/*.jpeg",
        "icon-128.png",
        "icon-34.png",
      ],
      matches: ["*://*/*"],
    },
  ],
};

export default manifest;
