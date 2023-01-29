import path from "path";
import fs from "fs";
import promptUser from "../../util/promptUser.js";
import clc from "cli-color";
import {
  createFileIfNotExists,
  createDirectoryIfNotExists,
  fileExists,
} from "../../util/files.js";
import writeFromTemplate from "../../util/writeFromTemplate.js";
import getCwd from "../../util/getCwd.js";
import { getRootPath } from "../../util/getRootPath.js";
import { importConfigFile } from "../../util/importConfig.js";
import { fileURLToPath } from "url";
import handleArgvCommands from "../../cmdArgs/handleArgvCommands.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export async function checkIsInitialized() {
  try {
    const configFilePath = getPetConfigPath();
    if (!fs.existsSync(configFilePath)) {
      return false;
    }
    const localConfig = await importConfigFile(configFilePath);
    if (!fs.existsSync(localConfig.basePath)) {
      return false;
    }
  } catch (e) {
    return false;
  }
  return true;
}

function getPetConfigPath() {
  const configFilePath = path.resolve(
    getRootPath(),
    "localConfig",
    "petConfig.js"
  );
  return configFilePath;
}

export function writePetConfig(basePath) {
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

export async function handleInit() {
  const initMessage = `First tell us where you want your config directory and snippets stored.\nIf you already have snippets directory, simply point to it.`;
  console.log(initMessage);
  const basePath = await promptUser(clc.white("Config Path:\t"), getCwd());
  writePetConfig(basePath);
  writeUserConfig(basePath);
  console.log(clc.bold.green("Done!"));
}

export async function handleConfig(argv, subcommands) {
  handleArgvCommands(
    [
      { commands: ["get", "g"], callback: handleGet },
      { commands: ["set", "s"], callback: handleInit },
    ],
    subcommands ? [subcommands, ...argv] : argv
  );
  async function handleGet() {
    const petConfigPath = getPetConfigPath();
    const petConfig = await importConfigFile(petConfigPath);
    for (const [key, value] of Object.entries(petConfig)) {
      console.log(`${clc.white(`${camelCaseToCapitalized(key)}:`)}\t${value}`);
    }
  }
}

function camelCaseToCapitalized(str) {
  return str.replace(/([A-Z])/g, " $1").replace(/^./, function (str) {
    return str.toUpperCase();
  });
}
