import colorLog from "../log";
import { PluginOption, build } from "vite";
import { resolve } from "path";
import { outputFolderName } from "../constants";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

const packages = [
  {
    content: resolve(__dirname, "../../", "src/pages/content/index.tsx"),
  },
];

const outDir = resolve(__dirname, "../../", outputFolderName);

const root = resolve(__dirname, "../../src");
const pagesDir = resolve(root, "pages");
const assetsDir = resolve(root, "assets");

export default function buildContentScript(): PluginOption {
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
              "@pages": pagesDir,
            },
          },
          plugins: [cssInjectedByJsPlugin()],
          build: {
            outDir,
            sourcemap: process.env.__DEV__ === "true",
            emptyOutDir: false,
            rollupOptions: {
              input: _package,
              output: {
                entryFileNames: (chunk) => {
                  return `src/pages/${chunk.name}/index.js`;
                },
              },
            },
          },
          configFile: false,
        });
      }
      colorLog("Content code build sucessfully", "success");
    },
  };
}
