const clc = require("cli-color");
const promptUser = require("../util/promptUser");
const { config } = require("../config");
const path = require("path");
const { fileExists, createDirectoryIfNotExists } = require("../util/files");
const spawn = require("child_process").spawn;

async function handleCreate() {
  const relativePath = await promptForFilePath();
  const absolutePath = path.resolve(config.path.dotPet, "..", relativePath);
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
  // TODO make editor customizable; there should be a machine-specific config; up to the user where to place settings
  // const editor = process.env.EDITOR || "nano";
  const process = spawn(config.textEditor, [filePath], {
    shell: true,
    stdio: "inherit",
  });
  return new Promise((resolve, reject) => {
    process.on("close", () => resolve());
    process.on("exit", () => resolve());
    process.on("error", () => reject());
  });
}

module.exports = handleCreate;
