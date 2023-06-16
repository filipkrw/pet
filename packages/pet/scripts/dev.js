import esbuild from "esbuild";
import { nodeExternalsPlugin } from "esbuild-node-externals";
import fg from "fast-glob";
import fs from "fs";
import nodeWatch from "node-watch";
import path from "path";

watch();

function watch() {
  console.log("Watching...");
  build();
  nodeWatch("src", { recursive: true }, build);
}

async function build() {
  esbuild
    .build({
      entryPoints: await findSourceFiles(),
      outdir: "lib",
      platform: "node",
      target: "esnext",
      format: "esm",
      tsconfig: "tsconfig.json",
      plugins: [nodeExternalsPlugin()],
      sourcemap: true,
    })
    .then(() => copyAssets())
    .then(() => console.log(`Built at ${new Date().toLocaleTimeString()}`))
    .catch(() => {});
}

async function copyAssets() {
  const assets = await findAssetFiles();
  assets.forEach((sourcePath) => {
    const destPath = sourcePath.replace(/^src/, "lib");
    createDirectoryIfNotExists(path.dirname(destPath));
    fs.copyFile(sourcePath, destPath, (err) => {
      if (err) throw err;
    });
  });
}

async function findSourceFiles() {
  const patterns = ["src/**/*.js", "src/**/*.ts"];
  return fg(patterns);
}

async function findAssetFiles() {
  const patterns = ["src/**/*.txt", "src/**/*.template"];
  return fg(patterns, { dot: true });
}

export function createDirectoryIfNotExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}
