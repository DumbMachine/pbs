import type { Manifest } from "webextension-polyfill";
import pkg from "../package.json";

// const manifest: Manifest.WebExtensionManifest = {
//   manifest_version: 3,
//   name: pkg.displayName,
//   version: pkg.version,
//   description: pkg.description,
//   options_ui: {
//     page: 'src/pages/options/index.html',
//   },
//   background: {
//     service_worker: 'src/pages/background/index.js',
//     type: 'module',
//   },
//   action: {
//     default_popup: 'src/pages/popup/index.html',
//     default_icon: 'icon-32.png',
//   },
//   chrome_url_overrides: {
//     newtab: 'src/pages/newtab/index.html',
//   },
//   icons: {
//     '128': 'icon-128.png',
//   },
//   permissions: ["activeTab"],
//   content_scripts: [
//     {
//       matches: ['http://*/*', 'https://*/*', '<all_urls>'],
//       js: ['src/pages/content/index.js'],
//       css: ['contentStyle.css'],
//     },
//   ],
//   devtools_page: 'src/pages/devtools/index.html',
//   web_accessible_resources: [
//     {
//       resources: ['contentStyle.css', 'icon-128.png', 'icon-32.png'],
//       matches: [],
//     },
//   ],
// };

// firefox manifest
const manifest: Manifest.WebExtensionManifest = {
  manifest_version: 2,
  name: pkg.displayName,
  version: pkg.version,
  description: pkg.description,
  options_ui: {
    page: "src/pages/options/index.html",
  },
  background: {
    // // ff:
    scripts: ["src/pages/background/index.js"],

    // chrome:
    // page: "src/pages/background/index.js",
    type: "module",
  },
  browser_action: {
    default_popup: "src/pages/popup/index.html",
    default_icon: {
      "16": "icon-16.png",
      "32": "icon-32.png",
      "64": "icon-64.png",
    },
  },
  icons: {
    "16": "icon-16.png",
    "32": "icon-32.png",
    "64": "icon-64.png",
    "128": "icon-128.png",
  },
  permissions: [
    "<all_urls>",
    "activeTab",
    "storage",
    "tabs",
    "bookmarks",
    "history",
    "search",
  ],
  // content_scripts: [
  //   {
  //     // matches: ["<all_urls>"],
  //     matches: ["*://*/"],
  //     js: ["src/pages/content/index.js"],
  //     // css: ["contentStyle.css"],
  //     // run_at: "document_start",
  //     // all_frames: true,
  //   },
  // ],
  content_scripts: [
    {
      matches: ["http://*/*", "https://*/*", "<all_urls>"],
      js: ["src/pages/content/index.js"],
      css: ["contentStyle.css"],
    },
  ],
  content_security_policy: "script-src 'self'; object-src 'self'",
  // content_security_policy: "script-src 'self'; object-src 'self'",
  // chrome_url_overrides: {
  //   newtab: "src/pages/newtab/index.html",
  // },
  // devtools_page: "src/pages/devtools/index.html",
  web_accessible_resources: ["contentStyle.css"],
};

export default manifest;
