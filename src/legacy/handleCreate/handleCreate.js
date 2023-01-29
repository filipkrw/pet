import clc from "cli-color";
import promptUser from "../util/promptUser.js";
import config from "../config.js";
import path from "path";
import { fileExists, createDirectoryIfNotExists } from "../util/files.js";
import { spawn } from "child_process";

const { config: globalConfig } = config;

async function handleCreate() {
  const relativePath = await promptForFilePath();
  const absolutePath = path.resolve(
    globalConfig.path.dotPet,
    "..",
    relativePath
  );
  createDirectoryIfNotExists(path.dirname(absolutePath));
  await openEditor(absolutePath);
  if (fileExists(absolutePath)) {
    console.log(clc.bold.green("Done!"));
  } else {
    console.log(clc.bold.yellow("Aborted"));
  }
}

async function promptForFilePath() {
  const filePath = await promptUser(clc.white("Path: "));
  return filePath;
}

async function openEditor(filePath) {
  const process = spawn(globalConfig.localConfig.textEditor, [filePath], {
    shell: true,
    stdio: "inherit",
  });
  return new Promise((resolve, reject) => {
    process.on("close", () => resolve());
    process.on("exit", () => resolve());
    process.on("error", () => reject());
  });
}

export default handleCreate;
