const path = require("path");
const fs = require("fs");
const promptUser = require("../util/promptUser");
const util = require("util");
const clc = require("cli-color");
const {
  createFileIfNotExists,
  createDirectoryIfNotExists,
  fileExists,
} = require("../util/files");
const writeFromTemplate = require("../util/writeFromTemplate");
const getCwd = require("../util/getCwd");

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
  writeFromTemplate(
    path.resolve(__dirname, "petConfig.template.js"),
    petConfigPath,
    { basePath }
  );
}

function writeUserConfig(basePath) {
  const dotPetPath = path.resolve(basePath, ".pet");
  const configPath = path.resolve(dotPetPath, "config.js");
  if (fileExists(configPath)) {
    console.log(`${clc.white("Info:")}\t\tExisting config file found.`);
    return;
  }
  console.log(`${clc.white("Info:")}\t\tNew config file created.`);
  createDirectoryIfNotExists(dotPetPath);
  writeFromTemplate(
    path.resolve(__dirname, "userConfig.template.js"),
    configPath
  );
}

async function handleInit() {
  const initMessage = `First, tell us where you want your ${clc.bold(
    ".pet"
  )} config directory stored.\nIf you already have it, simply point to it. (It won't be deleted).`;
  console.log(initMessage);
  const basePath = await promptUser(clc.white("Config Path:\t"), getCwd());
  writePetConfig(basePath);
  writeUserConfig(basePath);
  console.log(clc.bold.green("Done!"));
}

async function handleConfig(args) {
  if (args.get) {
    const petConfigPath = getPetConfigPath();
    const petConfig = require(petConfigPath);
    for (const [key, value] of Object.entries(petConfig)) {
      console.log(`${clc.white(`${camelCaseToCapitalized(key)}:`)}\t${value}`);
    }
  }
  if (args.set) {
    handleInit();
  }
}

function camelCaseToCapitalized(str) {
  return str.replace(/([A-Z])/g, " $1").replace(/^./, function (str) {
    return str.toUpperCase();
  });
}

module.exports = { handleInit, handleConfig, isInitialized, getPetConfigPath };
