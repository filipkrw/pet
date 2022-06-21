const clc = require("cli-color");
const promptUser = require("../util/promptUser");
const { config } = require("../config");
const path = require("path");
const { createFileIfNotExists } = require("../util/files");
const util = require("util");
const spawn = util.promisify(require("child_process").spawn);

module.exports = async function handleCreate() {
  const relativePath = await promptForFilePath();
  validateRelativePath(relativePath);
  const absolutePath = path.resolve(config.path.dotPet, "..", relativePath);
  createFileIfNotExists(absolutePath);
  openEditor(absolutePath);
  console.log(clc.bold.green("Done!"));
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
  const editor = process.env.EDITOR || "nano";
  await spawn(editor, [filePath], { stdio: "inherit" });
}
