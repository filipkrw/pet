import esbuild from "esbuild";
import { nodeExternalsPlugin } from "esbuild-node-externals";
import fg from "fast-glob";
import watch from "node-watch";
import { copyFile } from "fs";

build();
watch("src", { recursive: true }, () => build());

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
      console.log(getCurrentTime());
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

async function findFiles() {
  const patterns = ["src/**/*.js", "src/**/*.ts"];
  return await fg(patterns);
}

function copyAssets() {
  copyFile("src/handleHelp/help.txt", "lib/handleHelp/help.txt", (err) => {
    if (err) throw err;
  });
}

function getCurrentTime() {
  const date = new Date();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const minutesPadded = minutes < 10 ? `0${minutes}` : minutes;
  const seconds = date.getSeconds();
  const secondsPadded = seconds < 10 ? `0${seconds}` : seconds;
  return `${hours}:${minutesPadded}:${secondsPadded}`;
}
