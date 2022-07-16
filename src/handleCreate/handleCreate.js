const clc = require("cli-color");
const promptUser = require("../util/promptUser");
const { config } = require("../config");
const path = require("path");
const { fileExists } = require("../util/files");
const spawn = require("child_process").spawn;

module.exports = async function handleCreate() {
  const relativePath = await promptForFilePath();
  validateRelativePath(relativePath);
  const absolutePath = path.resolve(config.path.dotPet, "..", relativePath);
  await openEditor(absolutePath);
  if (fileExists(absolutePath)) {
    console.log(clc.bold.green("Done!"));
  } else {
    console.log(clc.bold.yellow("Aborted"));
  }
};

function validateRelativePath(filePath) {
  const pathRoot = path.normalize(filePath).split(path.sep)[0];
  // TODO what about nested sources?
  const source = config.userConfig.sources.find((s) => s.name === pathRoot);
  if (!source) {
    // TODO add propper loggers
    console.error(`Source "${pathRoot}" doesn't exist.`);
    process.exit(1);
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
