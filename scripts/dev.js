import esbuild from "esbuild";
import { nodeExternalsPlugin } from "esbuild-node-externals";
import fg from "fast-glob";
import nodeWatch from "node-watch";
import { copyFile } from "fs";

watch();

function watch() {
  console.log("Watching...");
  build();
  nodeWatch("src", { recursive: true }, () => build());
}

async function build() {
  esbuild
    .build({
      entryPoints: await findFiles(),
      outdir: "lib",
      platform: "node",
      target: "esnext",
      format: "esm",
      tsconfig: "tsconfig.json",
      plugins: [nodeExternalsPlugin()],
    })
    .then(() => {
      copyAssets();
      console.log("Updated at", getCurrentTime());
    })
    .catch((err) => {});
}

async function findFiles() {
  const patterns = ["src/**/*.js", "src/**/*.ts"];
  return await fg(patterns);
}

function copyAssets() {
  copyFile("src/handleHelp/help.txt", "lib/handleHelp/help.txt", (err) => {
    if (err) throw err;
  });
  copyFile(
    "src/flow/aliases/init/zsh/.zshrc_template",
    "lib/flow/aliases/init/zsh/.zshrc_template",
    (err) => {
      if (err) throw err;
    }
  );
}

function getCurrentTime() {
  return new Date().toLocaleTimeString();
}
