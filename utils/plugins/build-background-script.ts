import colorLog from "../log";
import { PluginOption, build } from "vite";
import { resolve } from "path";
import { outputFolderName } from "../constants";

import typescript from "rollup-plugin-typescript";

const packages = [
  {
    background: resolve(__dirname, "../../", "src/pages/background/index.ts"),
  },
];

const outDir = resolve(__dirname, "../../", outputFolderName);

export default function buildBackgroundScript(): PluginOption {
  return {
    name: "build-background-script",
    async buildEnd() {
      for (const _package of packages) {
        await build({
          publicDir: false,
          plugins: [typescript()],
          build: {
            lib: {
              entry: _package.background,
              name: "background",
              fileName: "background",
            },
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
      colorLog("Background code build sucessfully", "success");
    },
  };
}
