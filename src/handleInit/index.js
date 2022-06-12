const path = require("path");
const fs = require("fs");
const promptUser = require("../util/promptUser");
const util = require("util");
const clc = require("cli-color");
const createFileIfNotExists = require("../util/createFileIfNotExists");

function isInitialized() {
  const configFilePath = getPetConfigPath();
  return fs.existsSync(configFilePath);
}

function getPetConfigPath() {
  const srcPath = path.dirname(require.main.filename);
  const configFilePath = path.resolve(srcPath, "..", "petConfig.js");
  return configFilePath;
}

function writePetConfig(basePath) {
  const petConfigPath = getPetConfigPath();
  createFileIfNotExists(petConfigPath);
  const templatePath = path.resolve(__dirname, "petConfig.template.js");
  const template = fs.readFileSync(templatePath, "utf8");
  fs.writeFileSync(petConfigPath, util.format(template, basePath), {
    flag: "w",
  });
}

function writeUserConfig(basePath) {
  const userConfigPath = path.resolve(basePath, ".pet", "config.json");
  if (!fs.existsSync(userConfigPath)) {
    createFileIfNotExists(userConfigPath);
    fs.writeFileSync(userConfigPath, JSON.stringify({}, null, 2), {
      flag: "w",
    });
  }
}

async function handleInit() {
  const initMessage =
    "First, tell us where you want your snippets and configs stored.\nIf you already have some data, simply point to it. (It won't be deleted).\n";
  console.log(initMessage);
  const cwd = process.cwd().replace(/\\/g, "/");
  const basePath = await promptUser(clc.white("Path: "), cwd);
  writePetConfig(basePath);
  writeUserConfig(basePath);
}

module.exports = { handleInit, isInitialized };
