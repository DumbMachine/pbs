// vite.config.ts
import react from "file:///Users/dumbmachine/exp/surfingkeys/vite-web-extension/node_modules/@vitejs/plugin-react-swc/index.mjs";
import { resolve as resolve4 } from "path";
import { defineConfig } from "file:///Users/dumbmachine/exp/surfingkeys/vite-web-extension/node_modules/vite/dist/node/index.js";

// utils/plugins/make-manifest.ts
import * as fs from "fs";
import * as path from "path";

// utils/log.ts
function colorLog(message, type) {
  let color = type || COLORS.FgBlack;
  switch (type) {
    case "success":
      color = COLORS.FgGreen;
      break;
    case "info":
      color = COLORS.FgBlue;
      break;
    case "error":
      color = COLORS.FgRed;
      break;
    case "warning":
      color = COLORS.FgYellow;
      break;
  }
  console.log(color, message);
}
var COLORS = {
  Reset: "\x1B[0m",
  Bright: "\x1B[1m",
  Dim: "\x1B[2m",
  Underscore: "\x1B[4m",
  Blink: "\x1B[5m",
  Reverse: "\x1B[7m",
  Hidden: "\x1B[8m",
  FgBlack: "\x1B[30m",
  FgRed: "\x1B[31m",
  FgGreen: "\x1B[32m",
  FgYellow: "\x1B[33m",
  FgBlue: "\x1B[34m",
  FgMagenta: "\x1B[35m",
  FgCyan: "\x1B[36m",
  FgWhite: "\x1B[37m",
  BgBlack: "\x1B[40m",
  BgRed: "\x1B[41m",
  BgGreen: "\x1B[42m",
  BgYellow: "\x1B[43m",
  BgBlue: "\x1B[44m",
  BgMagenta: "\x1B[45m",
  BgCyan: "\x1B[46m",
  BgWhite: "\x1B[47m"
};

// package.json
var package_default = {
  name: "vite-web-extension",
  displayName: "Predictable Browser Shortcuts",
  version: "0.1.0",
  description: "A browser extension that add hints to ui elements, can are not _random_.",
  license: "MIT",
  repository: {
    type: "git",
    url: "https://github.com/dumbmachine/pbs.git"
  },
  scripts: {
    build: "vite build",
    dev: "nodemon",
    "dev-ff": 'nodemon --exec "vite build --mode development --force" --watch src --watch vite.config.ts',
    "dev-chrome": 'nodemon --exec "vite build --mode development --force" --watch src --watch vite.config.ts --watch manifest.json'
  },
  type: "module",
  dependencies: {
    "@headlessui/react": "^1.7.17",
    "@heroicons/react": "^2.0.18",
    "@leeoniya/ufuzzy": "^1.0.11",
    clsx: "^2.0.0",
    "css-selector-generator": "^3.6.6",
    dompurify: "^3.0.6",
    react: "^18.2.0",
    "react-dom": "^18.2.0",
    "use-debounce": "^10.0.0",
    "vite-plugin-css-injected-by-js": "^3.1.1",
    "webextension-polyfill": "^0.10.0"
  },
  devDependencies: {
    "@types/chrome": "^0.0.237",
    "@types/node": "^18.11.18",
    "@types/react": "^18.0.27",
    "@types/react-dom": "^18.0.10",
    "@types/webextension-polyfill": "^0.10.0",
    "@typescript-eslint/eslint-plugin": "^5.49.0",
    "@typescript-eslint/parser": "^5.49.0",
    "@vitejs/plugin-react-swc": "^3.0.1",
    autoprefixer: "^10.4.13",
    eslint: "^8.32.0",
    "eslint-config-prettier": "^8.6.0",
    "eslint-plugin-import": "^2.27.5",
    "eslint-plugin-jsx-a11y": "^6.7.1",
    "eslint-plugin-react": "^7.32.1",
    "eslint-plugin-react-hooks": "^4.3.0",
    "fs-extra": "^11.1.0",
    nodemon: "^2.0.20",
    postcss: "^8.4.21",
    "rollup-plugin-typescript": "^1.0.1",
    tailwindcss: "^3.2.4",
    "ts-node": "^10.9.1",
    typescript: "^4.9.4",
    vite: "^4.0.4"
  }
};

// src/manifest.ts
var manifest = {
  manifest_version: 2,
  name: package_default.displayName,
  version: package_default.version,
  description: package_default.description,
  options_ui: {
    page: "src/pages/options/index.html"
  },
  background: {
    // // ff:
    scripts: ["src/pages/background/index.js"],
    // chrome:
    // page: "src/pages/background/index.js",
    type: "module"
  },
  browser_action: {
    default_popup: "src/pages/popup/index.html",
    default_icon: {
      "16": "icon-16.png",
      "32": "icon-32.png",
      "64": "icon-64.png"
    }
  },
  icons: {
    "16": "icon-16.png",
    "32": "icon-32.png",
    "64": "icon-64.png",
    "128": "icon-128.png"
  },
  permissions: [
    "<all_urls>",
    "activeTab",
    "storage",
    "tabs",
    "bookmarks",
    "history",
    "search"
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
      css: ["contentStyle.css"]
    }
  ],
  content_security_policy: "script-src 'self'; object-src 'self'",
  // content_security_policy: "script-src 'self'; object-src 'self'",
  // chrome_url_overrides: {
  //   newtab: "src/pages/newtab/index.html",
  // },
  // devtools_page: "src/pages/devtools/index.html",
  web_accessible_resources: ["contentStyle.css"]
};
var manifest_default = manifest;

// utils/plugins/make-manifest.ts
var __vite_injected_original_dirname = "/Users/dumbmachine/exp/surfingkeys/vite-web-extension/utils/plugins";
var { resolve } = path;
var outDir = resolve(__vite_injected_original_dirname, "..", "..", "public");
function makeManifest() {
  return {
    name: "make-manifest",
    buildEnd() {
      if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir);
      }
      const manifestPath = resolve(outDir, "manifest.json");
      fs.writeFileSync(manifestPath, JSON.stringify(manifest_default, null, 2));
      colorLog(`Manifest file copy complete: ${manifestPath}`, "success");
    }
  };
}

// utils/plugins/build-content-script.ts
import { build } from "file:///Users/dumbmachine/exp/surfingkeys/vite-web-extension/node_modules/vite/dist/node/index.js";
import { resolve as resolve2 } from "path";

// utils/constants.ts
var outputFolderName = "dist";

// utils/plugins/build-content-script.ts
import cssInjectedByJsPlugin from "file:///Users/dumbmachine/exp/surfingkeys/vite-web-extension/node_modules/vite-plugin-css-injected-by-js/dist/esm/index.js";
var __vite_injected_original_dirname2 = "/Users/dumbmachine/exp/surfingkeys/vite-web-extension/utils/plugins";
var packages = [
  {
    content: resolve2(__vite_injected_original_dirname2, "../../", "src/pages/content/index.tsx")
  }
];
var outDir2 = resolve2(__vite_injected_original_dirname2, "../../", outputFolderName);
var root = resolve2(__vite_injected_original_dirname2, "../../src");
var pagesDir = resolve2(root, "pages");
var assetsDir = resolve2(root, "assets");
function buildContentScript() {
  return {
    name: "build-content",
    async buildEnd() {
      for (const _package of packages) {
        await build({
          publicDir: false,
          resolve: {
            alias: {
              "@src": root,
              "@assets": assetsDir,
              "@pages": pagesDir
            }
          },
          plugins: [cssInjectedByJsPlugin()],
          build: {
            outDir: outDir2,
            sourcemap: process.env.__DEV__ === "true",
            emptyOutDir: false,
            rollupOptions: {
              input: _package,
              output: {
                entryFileNames: (chunk) => {
                  return `src/pages/${chunk.name}/index.js`;
                }
              }
            }
          },
          configFile: false
        });
      }
      colorLog("Content code build sucessfully", "success");
    }
  };
}

// utils/plugins/build-background-script.ts
import { build as build2 } from "file:///Users/dumbmachine/exp/surfingkeys/vite-web-extension/node_modules/vite/dist/node/index.js";
import { resolve as resolve3 } from "path";
import typescript from "file:///Users/dumbmachine/exp/surfingkeys/vite-web-extension/node_modules/rollup-plugin-typescript/dist/rollup-plugin-typescript.cjs.js";
var __vite_injected_original_dirname3 = "/Users/dumbmachine/exp/surfingkeys/vite-web-extension/utils/plugins";
var packages2 = [
  {
    background: resolve3(__vite_injected_original_dirname3, "../../", "src/pages/background/index.ts")
  }
];
var outDir3 = resolve3(__vite_injected_original_dirname3, "../../", outputFolderName);
function buildBackgroundScript() {
  return {
    name: "build-background-script",
    async buildEnd() {
      for (const _package of packages2) {
        await build2({
          publicDir: false,
          plugins: [typescript()],
          build: {
            lib: {
              entry: _package.background,
              name: "background",
              fileName: "background"
            },
            outDir: outDir3,
            sourcemap: process.env.__DEV__ === "true",
            emptyOutDir: false,
            rollupOptions: {
              input: _package,
              output: {
                entryFileNames: (chunk) => {
                  return `src/pages/${chunk.name}/index.js`;
                }
              }
            }
          },
          configFile: false
        });
      }
      colorLog("Background code build sucessfully", "success");
    }
  };
}

// vite.config.ts
var __vite_injected_original_dirname4 = "/Users/dumbmachine/exp/surfingkeys/vite-web-extension";
var root2 = resolve4(__vite_injected_original_dirname4, "src");
var pagesDir2 = resolve4(root2, "pages");
var assetsDir2 = resolve4(root2, "assets");
var outDir4 = resolve4(__vite_injected_original_dirname4, outputFolderName);
var publicDir = resolve4(__vite_injected_original_dirname4, "public");
var vite_config_default = defineConfig({
  resolve: {
    alias: {
      "@src": root2,
      "@assets": assetsDir2,
      "@pages": pagesDir2
    }
  },
  plugins: [
    react(),
    makeManifest(),
    buildContentScript(),
    buildBackgroundScript()
  ],
  publicDir,
  build: {
    outDir: outDir4,
    sourcemap: process.env.__DEV__ === "true",
    emptyOutDir: false,
    rollupOptions: {
      input: {
        devtools: resolve4(pagesDir2, "devtools", "index.html"),
        panel: resolve4(pagesDir2, "panel", "index.html"),
        background: resolve4(pagesDir2, "background", "index.ts"),
        popup: resolve4(pagesDir2, "popup", "index.html"),
        newtab: resolve4(pagesDir2, "newtab", "index.html"),
        options: resolve4(pagesDir2, "options", "index.html")
      },
      output: {
        entryFileNames: (chunk) => `src/pages/${chunk.name}/index.js`
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAidXRpbHMvcGx1Z2lucy9tYWtlLW1hbmlmZXN0LnRzIiwgInV0aWxzL2xvZy50cyIsICJwYWNrYWdlLmpzb24iLCAic3JjL21hbmlmZXN0LnRzIiwgInV0aWxzL3BsdWdpbnMvYnVpbGQtY29udGVudC1zY3JpcHQudHMiLCAidXRpbHMvY29uc3RhbnRzLnRzIiwgInV0aWxzL3BsdWdpbnMvYnVpbGQtYmFja2dyb3VuZC1zY3JpcHQudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvZHVtYm1hY2hpbmUvZXhwL3N1cmZpbmdrZXlzL3ZpdGUtd2ViLWV4dGVuc2lvblwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2R1bWJtYWNoaW5lL2V4cC9zdXJmaW5na2V5cy92aXRlLXdlYi1leHRlbnNpb24vdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2R1bWJtYWNoaW5lL2V4cC9zdXJmaW5na2V5cy92aXRlLXdlYi1leHRlbnNpb24vdml0ZS5jb25maWcudHNcIjtpbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0LXN3Y1wiO1xuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IG1ha2VNYW5pZmVzdCBmcm9tIFwiLi91dGlscy9wbHVnaW5zL21ha2UtbWFuaWZlc3RcIjtcbmltcG9ydCBidWlsZENvbnRlbnRTY3JpcHQgZnJvbSBcIi4vdXRpbHMvcGx1Z2lucy9idWlsZC1jb250ZW50LXNjcmlwdFwiO1xuaW1wb3J0IGJ1aWxkQmFja2dyb3VuZFNjcmlwdCBmcm9tIFwiLi91dGlscy9wbHVnaW5zL2J1aWxkLWJhY2tncm91bmQtc2NyaXB0XCI7XG5pbXBvcnQgeyBvdXRwdXRGb2xkZXJOYW1lIH0gZnJvbSBcIi4vdXRpbHMvY29uc3RhbnRzXCI7XG5cbmNvbnN0IHJvb3QgPSByZXNvbHZlKF9fZGlybmFtZSwgXCJzcmNcIik7XG5jb25zdCBwYWdlc0RpciA9IHJlc29sdmUocm9vdCwgXCJwYWdlc1wiKTtcbmNvbnN0IGFzc2V0c0RpciA9IHJlc29sdmUocm9vdCwgXCJhc3NldHNcIik7XG5jb25zdCBvdXREaXIgPSByZXNvbHZlKF9fZGlybmFtZSwgb3V0cHV0Rm9sZGVyTmFtZSk7XG5jb25zdCBwdWJsaWNEaXIgPSByZXNvbHZlKF9fZGlybmFtZSwgXCJwdWJsaWNcIik7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgXCJAc3JjXCI6IHJvb3QsXG4gICAgICBcIkBhc3NldHNcIjogYXNzZXRzRGlyLFxuICAgICAgXCJAcGFnZXNcIjogcGFnZXNEaXIsXG4gICAgfSxcbiAgfSxcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KCksXG4gICAgbWFrZU1hbmlmZXN0KCksXG4gICAgYnVpbGRDb250ZW50U2NyaXB0KCksXG4gICAgYnVpbGRCYWNrZ3JvdW5kU2NyaXB0KCksXG4gIF0sXG4gIHB1YmxpY0RpcixcbiAgYnVpbGQ6IHtcbiAgICBvdXREaXIsXG4gICAgc291cmNlbWFwOiBwcm9jZXNzLmVudi5fX0RFVl9fID09PSBcInRydWVcIixcbiAgICBlbXB0eU91dERpcjogZmFsc2UsXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgaW5wdXQ6IHtcbiAgICAgICAgZGV2dG9vbHM6IHJlc29sdmUocGFnZXNEaXIsIFwiZGV2dG9vbHNcIiwgXCJpbmRleC5odG1sXCIpLFxuICAgICAgICBwYW5lbDogcmVzb2x2ZShwYWdlc0RpciwgXCJwYW5lbFwiLCBcImluZGV4Lmh0bWxcIiksXG4gICAgICAgIGJhY2tncm91bmQ6IHJlc29sdmUocGFnZXNEaXIsIFwiYmFja2dyb3VuZFwiLCBcImluZGV4LnRzXCIpLFxuICAgICAgICBwb3B1cDogcmVzb2x2ZShwYWdlc0RpciwgXCJwb3B1cFwiLCBcImluZGV4Lmh0bWxcIiksXG4gICAgICAgIG5ld3RhYjogcmVzb2x2ZShwYWdlc0RpciwgXCJuZXd0YWJcIiwgXCJpbmRleC5odG1sXCIpLFxuICAgICAgICBvcHRpb25zOiByZXNvbHZlKHBhZ2VzRGlyLCBcIm9wdGlvbnNcIiwgXCJpbmRleC5odG1sXCIpLFxuICAgICAgfSxcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBlbnRyeUZpbGVOYW1lczogKGNodW5rKSA9PiBgc3JjL3BhZ2VzLyR7Y2h1bmsubmFtZX0vaW5kZXguanNgLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxufSk7XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9kdW1ibWFjaGluZS9leHAvc3VyZmluZ2tleXMvdml0ZS13ZWItZXh0ZW5zaW9uL3V0aWxzL3BsdWdpbnNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9kdW1ibWFjaGluZS9leHAvc3VyZmluZ2tleXMvdml0ZS13ZWItZXh0ZW5zaW9uL3V0aWxzL3BsdWdpbnMvbWFrZS1tYW5pZmVzdC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvZHVtYm1hY2hpbmUvZXhwL3N1cmZpbmdrZXlzL3ZpdGUtd2ViLWV4dGVuc2lvbi91dGlscy9wbHVnaW5zL21ha2UtbWFuaWZlc3QudHNcIjtpbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IGNvbG9yTG9nIGZyb20gJy4uL2xvZyc7XG5pbXBvcnQgbWFuaWZlc3QgZnJvbSAnLi4vLi4vc3JjL21hbmlmZXN0JztcbmltcG9ydCB7IFBsdWdpbk9wdGlvbiB9IGZyb20gJ3ZpdGUnO1xuXG5jb25zdCB7IHJlc29sdmUgfSA9IHBhdGg7XG5cbmNvbnN0IG91dERpciA9IHJlc29sdmUoX19kaXJuYW1lLCAnLi4nLCAnLi4nLCAncHVibGljJyk7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG1ha2VNYW5pZmVzdCgpOiBQbHVnaW5PcHRpb24ge1xuICByZXR1cm4ge1xuICAgIG5hbWU6ICdtYWtlLW1hbmlmZXN0JyxcbiAgICBidWlsZEVuZCgpIHtcbiAgICAgIGlmICghZnMuZXhpc3RzU3luYyhvdXREaXIpKSB7XG4gICAgICAgIGZzLm1rZGlyU3luYyhvdXREaXIpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBtYW5pZmVzdFBhdGggPSByZXNvbHZlKG91dERpciwgJ21hbmlmZXN0Lmpzb24nKTtcblxuICAgICAgZnMud3JpdGVGaWxlU3luYyhtYW5pZmVzdFBhdGgsIEpTT04uc3RyaW5naWZ5KG1hbmlmZXN0LCBudWxsLCAyKSk7XG5cbiAgICAgIGNvbG9yTG9nKGBNYW5pZmVzdCBmaWxlIGNvcHkgY29tcGxldGU6ICR7bWFuaWZlc3RQYXRofWAsICdzdWNjZXNzJyk7XG4gICAgfSxcbiAgfTtcbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2R1bWJtYWNoaW5lL2V4cC9zdXJmaW5na2V5cy92aXRlLXdlYi1leHRlbnNpb24vdXRpbHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9kdW1ibWFjaGluZS9leHAvc3VyZmluZ2tleXMvdml0ZS13ZWItZXh0ZW5zaW9uL3V0aWxzL2xvZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvZHVtYm1hY2hpbmUvZXhwL3N1cmZpbmdrZXlzL3ZpdGUtd2ViLWV4dGVuc2lvbi91dGlscy9sb2cudHNcIjt0eXBlIENvbG9yVHlwZSA9ICdzdWNjZXNzJyB8ICdpbmZvJyB8ICdlcnJvcicgfCAnd2FybmluZycgfCBrZXlvZiB0eXBlb2YgQ09MT1JTO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjb2xvckxvZyhtZXNzYWdlOiBzdHJpbmcsIHR5cGU/OiBDb2xvclR5cGUpIHtcbiAgbGV0IGNvbG9yOiBzdHJpbmcgPSB0eXBlIHx8IENPTE9SUy5GZ0JsYWNrO1xuXG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgJ3N1Y2Nlc3MnOlxuICAgICAgY29sb3IgPSBDT0xPUlMuRmdHcmVlbjtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ2luZm8nOlxuICAgICAgY29sb3IgPSBDT0xPUlMuRmdCbHVlO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnZXJyb3InOlxuICAgICAgY29sb3IgPSBDT0xPUlMuRmdSZWQ7XG4gICAgICBicmVhaztcbiAgICBjYXNlICd3YXJuaW5nJzpcbiAgICAgIGNvbG9yID0gQ09MT1JTLkZnWWVsbG93O1xuICAgICAgYnJlYWs7XG4gIH1cblxuICBjb25zb2xlLmxvZyhjb2xvciwgbWVzc2FnZSk7XG59XG5cbmNvbnN0IENPTE9SUyA9IHtcbiAgUmVzZXQ6ICdcXHgxYlswbScsXG4gIEJyaWdodDogJ1xceDFiWzFtJyxcbiAgRGltOiAnXFx4MWJbMm0nLFxuICBVbmRlcnNjb3JlOiAnXFx4MWJbNG0nLFxuICBCbGluazogJ1xceDFiWzVtJyxcbiAgUmV2ZXJzZTogJ1xceDFiWzdtJyxcbiAgSGlkZGVuOiAnXFx4MWJbOG0nLFxuICBGZ0JsYWNrOiAnXFx4MWJbMzBtJyxcbiAgRmdSZWQ6ICdcXHgxYlszMW0nLFxuICBGZ0dyZWVuOiAnXFx4MWJbMzJtJyxcbiAgRmdZZWxsb3c6ICdcXHgxYlszM20nLFxuICBGZ0JsdWU6ICdcXHgxYlszNG0nLFxuICBGZ01hZ2VudGE6ICdcXHgxYlszNW0nLFxuICBGZ0N5YW46ICdcXHgxYlszNm0nLFxuICBGZ1doaXRlOiAnXFx4MWJbMzdtJyxcbiAgQmdCbGFjazogJ1xceDFiWzQwbScsXG4gIEJnUmVkOiAnXFx4MWJbNDFtJyxcbiAgQmdHcmVlbjogJ1xceDFiWzQybScsXG4gIEJnWWVsbG93OiAnXFx4MWJbNDNtJyxcbiAgQmdCbHVlOiAnXFx4MWJbNDRtJyxcbiAgQmdNYWdlbnRhOiAnXFx4MWJbNDVtJyxcbiAgQmdDeWFuOiAnXFx4MWJbNDZtJyxcbiAgQmdXaGl0ZTogJ1xceDFiWzQ3bScsXG59IGFzIGNvbnN0O1xuIiwgIntcbiAgXCJuYW1lXCI6IFwidml0ZS13ZWItZXh0ZW5zaW9uXCIsXG4gIFwiZGlzcGxheU5hbWVcIjogXCJQcmVkaWN0YWJsZSBCcm93c2VyIFNob3J0Y3V0c1wiLFxuICBcInZlcnNpb25cIjogXCIwLjEuMFwiLFxuICBcImRlc2NyaXB0aW9uXCI6IFwiQSBicm93c2VyIGV4dGVuc2lvbiB0aGF0IGFkZCBoaW50cyB0byB1aSBlbGVtZW50cywgY2FuIGFyZSBub3QgX3JhbmRvbV8uXCIsXG4gIFwibGljZW5zZVwiOiBcIk1JVFwiLFxuICBcInJlcG9zaXRvcnlcIjoge1xuICAgIFwidHlwZVwiOiBcImdpdFwiLFxuICAgIFwidXJsXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL2R1bWJtYWNoaW5lL3Bicy5naXRcIlxuICB9LFxuICBcInNjcmlwdHNcIjoge1xuICAgIFwiYnVpbGRcIjogXCJ2aXRlIGJ1aWxkXCIsXG4gICAgXCJkZXZcIjogXCJub2RlbW9uXCIsXG4gICAgXCJkZXYtZmZcIjogXCJub2RlbW9uIC0tZXhlYyBcXFwidml0ZSBidWlsZCAtLW1vZGUgZGV2ZWxvcG1lbnQgLS1mb3JjZVxcXCIgLS13YXRjaCBzcmMgLS13YXRjaCB2aXRlLmNvbmZpZy50c1wiLFxuICAgIFwiZGV2LWNocm9tZVwiOiBcIm5vZGVtb24gLS1leGVjIFxcXCJ2aXRlIGJ1aWxkIC0tbW9kZSBkZXZlbG9wbWVudCAtLWZvcmNlXFxcIiAtLXdhdGNoIHNyYyAtLXdhdGNoIHZpdGUuY29uZmlnLnRzIC0td2F0Y2ggbWFuaWZlc3QuanNvblwiXG4gIH0sXG4gIFwidHlwZVwiOiBcIm1vZHVsZVwiLFxuICBcImRlcGVuZGVuY2llc1wiOiB7XG4gICAgXCJAaGVhZGxlc3N1aS9yZWFjdFwiOiBcIl4xLjcuMTdcIixcbiAgICBcIkBoZXJvaWNvbnMvcmVhY3RcIjogXCJeMi4wLjE4XCIsXG4gICAgXCJAbGVlb25peWEvdWZ1enp5XCI6IFwiXjEuMC4xMVwiLFxuICAgIFwiY2xzeFwiOiBcIl4yLjAuMFwiLFxuICAgIFwiY3NzLXNlbGVjdG9yLWdlbmVyYXRvclwiOiBcIl4zLjYuNlwiLFxuICAgIFwiZG9tcHVyaWZ5XCI6IFwiXjMuMC42XCIsXG4gICAgXCJyZWFjdFwiOiBcIl4xOC4yLjBcIixcbiAgICBcInJlYWN0LWRvbVwiOiBcIl4xOC4yLjBcIixcbiAgICBcInVzZS1kZWJvdW5jZVwiOiBcIl4xMC4wLjBcIixcbiAgICBcInZpdGUtcGx1Z2luLWNzcy1pbmplY3RlZC1ieS1qc1wiOiBcIl4zLjEuMVwiLFxuICAgIFwid2ViZXh0ZW5zaW9uLXBvbHlmaWxsXCI6IFwiXjAuMTAuMFwiXG4gIH0sXG4gIFwiZGV2RGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcIkB0eXBlcy9jaHJvbWVcIjogXCJeMC4wLjIzN1wiLFxuICAgIFwiQHR5cGVzL25vZGVcIjogXCJeMTguMTEuMThcIixcbiAgICBcIkB0eXBlcy9yZWFjdFwiOiBcIl4xOC4wLjI3XCIsXG4gICAgXCJAdHlwZXMvcmVhY3QtZG9tXCI6IFwiXjE4LjAuMTBcIixcbiAgICBcIkB0eXBlcy93ZWJleHRlbnNpb24tcG9seWZpbGxcIjogXCJeMC4xMC4wXCIsXG4gICAgXCJAdHlwZXNjcmlwdC1lc2xpbnQvZXNsaW50LXBsdWdpblwiOiBcIl41LjQ5LjBcIixcbiAgICBcIkB0eXBlc2NyaXB0LWVzbGludC9wYXJzZXJcIjogXCJeNS40OS4wXCIsXG4gICAgXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjogXCJeMy4wLjFcIixcbiAgICBcImF1dG9wcmVmaXhlclwiOiBcIl4xMC40LjEzXCIsXG4gICAgXCJlc2xpbnRcIjogXCJeOC4zMi4wXCIsXG4gICAgXCJlc2xpbnQtY29uZmlnLXByZXR0aWVyXCI6IFwiXjguNi4wXCIsXG4gICAgXCJlc2xpbnQtcGx1Z2luLWltcG9ydFwiOiBcIl4yLjI3LjVcIixcbiAgICBcImVzbGludC1wbHVnaW4tanN4LWExMXlcIjogXCJeNi43LjFcIixcbiAgICBcImVzbGludC1wbHVnaW4tcmVhY3RcIjogXCJeNy4zMi4xXCIsXG4gICAgXCJlc2xpbnQtcGx1Z2luLXJlYWN0LWhvb2tzXCI6IFwiXjQuMy4wXCIsXG4gICAgXCJmcy1leHRyYVwiOiBcIl4xMS4xLjBcIixcbiAgICBcIm5vZGVtb25cIjogXCJeMi4wLjIwXCIsXG4gICAgXCJwb3N0Y3NzXCI6IFwiXjguNC4yMVwiLFxuICAgIFwicm9sbHVwLXBsdWdpbi10eXBlc2NyaXB0XCI6IFwiXjEuMC4xXCIsXG4gICAgXCJ0YWlsd2luZGNzc1wiOiBcIl4zLjIuNFwiLFxuICAgIFwidHMtbm9kZVwiOiBcIl4xMC45LjFcIixcbiAgICBcInR5cGVzY3JpcHRcIjogXCJeNC45LjRcIixcbiAgICBcInZpdGVcIjogXCJeNC4wLjRcIlxuICB9XG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9kdW1ibWFjaGluZS9leHAvc3VyZmluZ2tleXMvdml0ZS13ZWItZXh0ZW5zaW9uL3NyY1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2R1bWJtYWNoaW5lL2V4cC9zdXJmaW5na2V5cy92aXRlLXdlYi1leHRlbnNpb24vc3JjL21hbmlmZXN0LnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9kdW1ibWFjaGluZS9leHAvc3VyZmluZ2tleXMvdml0ZS13ZWItZXh0ZW5zaW9uL3NyYy9tYW5pZmVzdC50c1wiO2ltcG9ydCB0eXBlIHsgTWFuaWZlc3QgfSBmcm9tIFwid2ViZXh0ZW5zaW9uLXBvbHlmaWxsXCI7XG5pbXBvcnQgcGtnIGZyb20gXCIuLi9wYWNrYWdlLmpzb25cIjtcblxuLy8gY29uc3QgbWFuaWZlc3Q6IE1hbmlmZXN0LldlYkV4dGVuc2lvbk1hbmlmZXN0ID0ge1xuLy8gICBtYW5pZmVzdF92ZXJzaW9uOiAzLFxuLy8gICBuYW1lOiBwa2cuZGlzcGxheU5hbWUsXG4vLyAgIHZlcnNpb246IHBrZy52ZXJzaW9uLFxuLy8gICBkZXNjcmlwdGlvbjogcGtnLmRlc2NyaXB0aW9uLFxuLy8gICBvcHRpb25zX3VpOiB7XG4vLyAgICAgcGFnZTogJ3NyYy9wYWdlcy9vcHRpb25zL2luZGV4Lmh0bWwnLFxuLy8gICB9LFxuLy8gICBiYWNrZ3JvdW5kOiB7XG4vLyAgICAgc2VydmljZV93b3JrZXI6ICdzcmMvcGFnZXMvYmFja2dyb3VuZC9pbmRleC5qcycsXG4vLyAgICAgdHlwZTogJ21vZHVsZScsXG4vLyAgIH0sXG4vLyAgIGFjdGlvbjoge1xuLy8gICAgIGRlZmF1bHRfcG9wdXA6ICdzcmMvcGFnZXMvcG9wdXAvaW5kZXguaHRtbCcsXG4vLyAgICAgZGVmYXVsdF9pY29uOiAnaWNvbi0zMi5wbmcnLFxuLy8gICB9LFxuLy8gICBjaHJvbWVfdXJsX292ZXJyaWRlczoge1xuLy8gICAgIG5ld3RhYjogJ3NyYy9wYWdlcy9uZXd0YWIvaW5kZXguaHRtbCcsXG4vLyAgIH0sXG4vLyAgIGljb25zOiB7XG4vLyAgICAgJzEyOCc6ICdpY29uLTEyOC5wbmcnLFxuLy8gICB9LFxuLy8gICBwZXJtaXNzaW9uczogW1wiYWN0aXZlVGFiXCJdLFxuLy8gICBjb250ZW50X3NjcmlwdHM6IFtcbi8vICAgICB7XG4vLyAgICAgICBtYXRjaGVzOiBbJ2h0dHA6Ly8qLyonLCAnaHR0cHM6Ly8qLyonLCAnPGFsbF91cmxzPiddLFxuLy8gICAgICAganM6IFsnc3JjL3BhZ2VzL2NvbnRlbnQvaW5kZXguanMnXSxcbi8vICAgICAgIGNzczogWydjb250ZW50U3R5bGUuY3NzJ10sXG4vLyAgICAgfSxcbi8vICAgXSxcbi8vICAgZGV2dG9vbHNfcGFnZTogJ3NyYy9wYWdlcy9kZXZ0b29scy9pbmRleC5odG1sJyxcbi8vICAgd2ViX2FjY2Vzc2libGVfcmVzb3VyY2VzOiBbXG4vLyAgICAge1xuLy8gICAgICAgcmVzb3VyY2VzOiBbJ2NvbnRlbnRTdHlsZS5jc3MnLCAnaWNvbi0xMjgucG5nJywgJ2ljb24tMzIucG5nJ10sXG4vLyAgICAgICBtYXRjaGVzOiBbXSxcbi8vICAgICB9LFxuLy8gICBdLFxuLy8gfTtcblxuLy8gZmlyZWZveCBtYW5pZmVzdFxuY29uc3QgbWFuaWZlc3Q6IE1hbmlmZXN0LldlYkV4dGVuc2lvbk1hbmlmZXN0ID0ge1xuICBtYW5pZmVzdF92ZXJzaW9uOiAyLFxuICBuYW1lOiBwa2cuZGlzcGxheU5hbWUsXG4gIHZlcnNpb246IHBrZy52ZXJzaW9uLFxuICBkZXNjcmlwdGlvbjogcGtnLmRlc2NyaXB0aW9uLFxuICBvcHRpb25zX3VpOiB7XG4gICAgcGFnZTogXCJzcmMvcGFnZXMvb3B0aW9ucy9pbmRleC5odG1sXCIsXG4gIH0sXG4gIGJhY2tncm91bmQ6IHtcbiAgICAvLyAvLyBmZjpcbiAgICBzY3JpcHRzOiBbXCJzcmMvcGFnZXMvYmFja2dyb3VuZC9pbmRleC5qc1wiXSxcblxuICAgIC8vIGNocm9tZTpcbiAgICAvLyBwYWdlOiBcInNyYy9wYWdlcy9iYWNrZ3JvdW5kL2luZGV4LmpzXCIsXG4gICAgdHlwZTogXCJtb2R1bGVcIixcbiAgfSxcbiAgYnJvd3Nlcl9hY3Rpb246IHtcbiAgICBkZWZhdWx0X3BvcHVwOiBcInNyYy9wYWdlcy9wb3B1cC9pbmRleC5odG1sXCIsXG4gICAgZGVmYXVsdF9pY29uOiB7XG4gICAgICBcIjE2XCI6IFwiaWNvbi0xNi5wbmdcIixcbiAgICAgIFwiMzJcIjogXCJpY29uLTMyLnBuZ1wiLFxuICAgICAgXCI2NFwiOiBcImljb24tNjQucG5nXCIsXG4gICAgfSxcbiAgfSxcbiAgaWNvbnM6IHtcbiAgICBcIjE2XCI6IFwiaWNvbi0xNi5wbmdcIixcbiAgICBcIjMyXCI6IFwiaWNvbi0zMi5wbmdcIixcbiAgICBcIjY0XCI6IFwiaWNvbi02NC5wbmdcIixcbiAgICBcIjEyOFwiOiBcImljb24tMTI4LnBuZ1wiLFxuICB9LFxuICBwZXJtaXNzaW9uczogW1xuICAgIFwiPGFsbF91cmxzPlwiLFxuICAgIFwiYWN0aXZlVGFiXCIsXG4gICAgXCJzdG9yYWdlXCIsXG4gICAgXCJ0YWJzXCIsXG4gICAgXCJib29rbWFya3NcIixcbiAgICBcImhpc3RvcnlcIixcbiAgICBcInNlYXJjaFwiLFxuICBdLFxuICAvLyBjb250ZW50X3NjcmlwdHM6IFtcbiAgLy8gICB7XG4gIC8vICAgICAvLyBtYXRjaGVzOiBbXCI8YWxsX3VybHM+XCJdLFxuICAvLyAgICAgbWF0Y2hlczogW1wiKjovLyovXCJdLFxuICAvLyAgICAganM6IFtcInNyYy9wYWdlcy9jb250ZW50L2luZGV4LmpzXCJdLFxuICAvLyAgICAgLy8gY3NzOiBbXCJjb250ZW50U3R5bGUuY3NzXCJdLFxuICAvLyAgICAgLy8gcnVuX2F0OiBcImRvY3VtZW50X3N0YXJ0XCIsXG4gIC8vICAgICAvLyBhbGxfZnJhbWVzOiB0cnVlLFxuICAvLyAgIH0sXG4gIC8vIF0sXG4gIGNvbnRlbnRfc2NyaXB0czogW1xuICAgIHtcbiAgICAgIG1hdGNoZXM6IFtcImh0dHA6Ly8qLypcIiwgXCJodHRwczovLyovKlwiLCBcIjxhbGxfdXJscz5cIl0sXG4gICAgICBqczogW1wic3JjL3BhZ2VzL2NvbnRlbnQvaW5kZXguanNcIl0sXG4gICAgICBjc3M6IFtcImNvbnRlbnRTdHlsZS5jc3NcIl0sXG4gICAgfSxcbiAgXSxcbiAgY29udGVudF9zZWN1cml0eV9wb2xpY3k6IFwic2NyaXB0LXNyYyAnc2VsZic7IG9iamVjdC1zcmMgJ3NlbGYnXCIsXG4gIC8vIGNvbnRlbnRfc2VjdXJpdHlfcG9saWN5OiBcInNjcmlwdC1zcmMgJ3NlbGYnOyBvYmplY3Qtc3JjICdzZWxmJ1wiLFxuICAvLyBjaHJvbWVfdXJsX292ZXJyaWRlczoge1xuICAvLyAgIG5ld3RhYjogXCJzcmMvcGFnZXMvbmV3dGFiL2luZGV4Lmh0bWxcIixcbiAgLy8gfSxcbiAgLy8gZGV2dG9vbHNfcGFnZTogXCJzcmMvcGFnZXMvZGV2dG9vbHMvaW5kZXguaHRtbFwiLFxuICB3ZWJfYWNjZXNzaWJsZV9yZXNvdXJjZXM6IFtcImNvbnRlbnRTdHlsZS5jc3NcIl0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBtYW5pZmVzdDtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2R1bWJtYWNoaW5lL2V4cC9zdXJmaW5na2V5cy92aXRlLXdlYi1leHRlbnNpb24vdXRpbHMvcGx1Z2luc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2R1bWJtYWNoaW5lL2V4cC9zdXJmaW5na2V5cy92aXRlLXdlYi1leHRlbnNpb24vdXRpbHMvcGx1Z2lucy9idWlsZC1jb250ZW50LXNjcmlwdC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvZHVtYm1hY2hpbmUvZXhwL3N1cmZpbmdrZXlzL3ZpdGUtd2ViLWV4dGVuc2lvbi91dGlscy9wbHVnaW5zL2J1aWxkLWNvbnRlbnQtc2NyaXB0LnRzXCI7aW1wb3J0IGNvbG9yTG9nIGZyb20gXCIuLi9sb2dcIjtcbmltcG9ydCB7IFBsdWdpbk9wdGlvbiwgYnVpbGQgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBvdXRwdXRGb2xkZXJOYW1lIH0gZnJvbSBcIi4uL2NvbnN0YW50c1wiO1xuaW1wb3J0IGNzc0luamVjdGVkQnlKc1BsdWdpbiBmcm9tIFwidml0ZS1wbHVnaW4tY3NzLWluamVjdGVkLWJ5LWpzXCI7XG5cbmNvbnN0IHBhY2thZ2VzID0gW1xuICB7XG4gICAgY29udGVudDogcmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi4vLi4vXCIsIFwic3JjL3BhZ2VzL2NvbnRlbnQvaW5kZXgudHN4XCIpLFxuICB9LFxuXTtcblxuY29uc3Qgb3V0RGlyID0gcmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi4vLi4vXCIsIG91dHB1dEZvbGRlck5hbWUpO1xuXG5jb25zdCByb290ID0gcmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi4vLi4vc3JjXCIpO1xuY29uc3QgcGFnZXNEaXIgPSByZXNvbHZlKHJvb3QsIFwicGFnZXNcIik7XG5jb25zdCBhc3NldHNEaXIgPSByZXNvbHZlKHJvb3QsIFwiYXNzZXRzXCIpO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBidWlsZENvbnRlbnRTY3JpcHQoKTogUGx1Z2luT3B0aW9uIHtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiBcImJ1aWxkLWNvbnRlbnRcIixcbiAgICBhc3luYyBidWlsZEVuZCgpIHtcbiAgICAgIGZvciAoY29uc3QgX3BhY2thZ2Ugb2YgcGFja2FnZXMpIHtcbiAgICAgICAgYXdhaXQgYnVpbGQoe1xuICAgICAgICAgIHB1YmxpY0RpcjogZmFsc2UsXG4gICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgYWxpYXM6IHtcbiAgICAgICAgICAgICAgXCJAc3JjXCI6IHJvb3QsXG4gICAgICAgICAgICAgIFwiQGFzc2V0c1wiOiBhc3NldHNEaXIsXG4gICAgICAgICAgICAgIFwiQHBhZ2VzXCI6IHBhZ2VzRGlyLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHBsdWdpbnM6IFtjc3NJbmplY3RlZEJ5SnNQbHVnaW4oKV0sXG4gICAgICAgICAgYnVpbGQ6IHtcbiAgICAgICAgICAgIG91dERpcixcbiAgICAgICAgICAgIHNvdXJjZW1hcDogcHJvY2Vzcy5lbnYuX19ERVZfXyA9PT0gXCJ0cnVlXCIsXG4gICAgICAgICAgICBlbXB0eU91dERpcjogZmFsc2UsXG4gICAgICAgICAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICAgICAgICAgIGlucHV0OiBfcGFja2FnZSxcbiAgICAgICAgICAgICAgb3V0cHV0OiB7XG4gICAgICAgICAgICAgICAgZW50cnlGaWxlTmFtZXM6IChjaHVuaykgPT4ge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIGBzcmMvcGFnZXMvJHtjaHVuay5uYW1lfS9pbmRleC5qc2A7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBjb25maWdGaWxlOiBmYWxzZSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBjb2xvckxvZyhcIkNvbnRlbnQgY29kZSBidWlsZCBzdWNlc3NmdWxseVwiLCBcInN1Y2Nlc3NcIik7XG4gICAgfSxcbiAgfTtcbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2R1bWJtYWNoaW5lL2V4cC9zdXJmaW5na2V5cy92aXRlLXdlYi1leHRlbnNpb24vdXRpbHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9kdW1ibWFjaGluZS9leHAvc3VyZmluZ2tleXMvdml0ZS13ZWItZXh0ZW5zaW9uL3V0aWxzL2NvbnN0YW50cy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvZHVtYm1hY2hpbmUvZXhwL3N1cmZpbmdrZXlzL3ZpdGUtd2ViLWV4dGVuc2lvbi91dGlscy9jb25zdGFudHMudHNcIjtleHBvcnQgY29uc3Qgb3V0cHV0Rm9sZGVyTmFtZSA9ICdkaXN0JztcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2R1bWJtYWNoaW5lL2V4cC9zdXJmaW5na2V5cy92aXRlLXdlYi1leHRlbnNpb24vdXRpbHMvcGx1Z2luc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2R1bWJtYWNoaW5lL2V4cC9zdXJmaW5na2V5cy92aXRlLXdlYi1leHRlbnNpb24vdXRpbHMvcGx1Z2lucy9idWlsZC1iYWNrZ3JvdW5kLXNjcmlwdC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvZHVtYm1hY2hpbmUvZXhwL3N1cmZpbmdrZXlzL3ZpdGUtd2ViLWV4dGVuc2lvbi91dGlscy9wbHVnaW5zL2J1aWxkLWJhY2tncm91bmQtc2NyaXB0LnRzXCI7aW1wb3J0IGNvbG9yTG9nIGZyb20gXCIuLi9sb2dcIjtcbmltcG9ydCB7IFBsdWdpbk9wdGlvbiwgYnVpbGQgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBvdXRwdXRGb2xkZXJOYW1lIH0gZnJvbSBcIi4uL2NvbnN0YW50c1wiO1xuXG5pbXBvcnQgdHlwZXNjcmlwdCBmcm9tIFwicm9sbHVwLXBsdWdpbi10eXBlc2NyaXB0XCI7XG5cbmNvbnN0IHBhY2thZ2VzID0gW1xuICB7XG4gICAgYmFja2dyb3VuZDogcmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi4vLi4vXCIsIFwic3JjL3BhZ2VzL2JhY2tncm91bmQvaW5kZXgudHNcIiksXG4gIH0sXG5dO1xuXG5jb25zdCBvdXREaXIgPSByZXNvbHZlKF9fZGlybmFtZSwgXCIuLi8uLi9cIiwgb3V0cHV0Rm9sZGVyTmFtZSk7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGJ1aWxkQmFja2dyb3VuZFNjcmlwdCgpOiBQbHVnaW5PcHRpb24ge1xuICByZXR1cm4ge1xuICAgIG5hbWU6IFwiYnVpbGQtYmFja2dyb3VuZC1zY3JpcHRcIixcbiAgICBhc3luYyBidWlsZEVuZCgpIHtcbiAgICAgIGZvciAoY29uc3QgX3BhY2thZ2Ugb2YgcGFja2FnZXMpIHtcbiAgICAgICAgYXdhaXQgYnVpbGQoe1xuICAgICAgICAgIHB1YmxpY0RpcjogZmFsc2UsXG4gICAgICAgICAgcGx1Z2luczogW3R5cGVzY3JpcHQoKV0sXG4gICAgICAgICAgYnVpbGQ6IHtcbiAgICAgICAgICAgIGxpYjoge1xuICAgICAgICAgICAgICBlbnRyeTogX3BhY2thZ2UuYmFja2dyb3VuZCxcbiAgICAgICAgICAgICAgbmFtZTogXCJiYWNrZ3JvdW5kXCIsXG4gICAgICAgICAgICAgIGZpbGVOYW1lOiBcImJhY2tncm91bmRcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvdXREaXIsXG4gICAgICAgICAgICBzb3VyY2VtYXA6IHByb2Nlc3MuZW52Ll9fREVWX18gPT09IFwidHJ1ZVwiLFxuICAgICAgICAgICAgZW1wdHlPdXREaXI6IGZhbHNlLFxuICAgICAgICAgICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgICAgICAgICBpbnB1dDogX3BhY2thZ2UsXG4gICAgICAgICAgICAgIG91dHB1dDoge1xuICAgICAgICAgICAgICAgIGVudHJ5RmlsZU5hbWVzOiAoY2h1bmspID0+IHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBgc3JjL3BhZ2VzLyR7Y2h1bmsubmFtZX0vaW5kZXguanNgO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgY29uZmlnRmlsZTogZmFsc2UsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgY29sb3JMb2coXCJCYWNrZ3JvdW5kIGNvZGUgYnVpbGQgc3VjZXNzZnVsbHlcIiwgXCJzdWNjZXNzXCIpO1xuICAgIH0sXG4gIH07XG59XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWlWLE9BQU8sV0FBVztBQUNuVyxTQUFTLFdBQUFBLGdCQUFlO0FBQ3hCLFNBQVMsb0JBQW9COzs7QUNGa1csWUFBWSxRQUFRO0FB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O0FBQUEsTUFDTCxRQUFRRjtBQUFBLE1BQ1IsV0FBV0k7QUFBQSxNQUNYLFVBQVVEO0FBQUEsSUFDWjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLGFBQWE7QUFBQSxJQUNiLG1CQUFtQjtBQUFBLElBQ25CLHNCQUFzQjtBQUFBLEVBQ3hCO0FBQUEsRUFDQTtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsUUFBQUU7QUFBQSxJQUNBLFdBQVcsUUFBUSxJQUFJLFlBQVk7QUFBQSxJQUNuQyxhQUFhO0FBQUEsSUFDYixlQUFlO0FBQUEsTUFDYixPQUFPO0FBQUEsUUFDTCxVQUFVSixTQUFRRSxXQUFVLFlBQVksWUFBWTtBQUFBLFFBQ3BELE9BQU9GLFNBQVFFLFdBQVUsU0FBUyxZQUFZO0FBQUEsUUFDOUMsWUFBWUYsU0FBUUUsV0FBVSxjQUFjLFVBQVU7QUFBQSxRQUN0RCxPQUFPRixTQUFRRSxXQUFVLFNBQVMsWUFBWTtBQUFBLFFBQzlDLFFBQVFGLFNBQVFFLFdBQVUsVUFBVSxZQUFZO0FBQUEsUUFDaEQsU0FBU0YsU0FBUUUsV0FBVSxXQUFXLFlBQVk7QUFBQSxNQUNwRDtBQUFBLE1BQ0EsUUFBUTtBQUFBLFFBQ04sZ0JBQWdCLENBQUMsVUFBVSxhQUFhLE1BQU07QUFBQSxNQUNoRDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFsicmVzb2x2ZSIsICJyZXNvbHZlIiwgIl9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lIiwgInJlc29sdmUiLCAiX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUiLCAib3V0RGlyIiwgImJ1aWxkIiwgInJlc29sdmUiLCAiX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUiLCAicGFja2FnZXMiLCAicmVzb2x2ZSIsICJfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSIsICJvdXREaXIiLCAiYnVpbGQiLCAiX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUiLCAicm9vdCIsICJyZXNvbHZlIiwgIl9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lIiwgInBhZ2VzRGlyIiwgImFzc2V0c0RpciIsICJvdXREaXIiXQp9Cg==
