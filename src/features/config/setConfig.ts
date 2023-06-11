import clc from "cli-color";
import promptUser from "../../util/promptUser.js";
import getCwd from "../../util/getCwd.js";
import { LocalConfig } from "../core/types.js";
import { getLocalConfigPath } from "../core/loadConfigs/getLocalConfigPath.js";
import {
  createDirectoryIfNotExists,
  createFileIfNotExists,
  fileExists,
} from "../../util/files.js";
import writeFromTemplate from "../../util/writeFromTemplate.js";
import path from "path";
import { exec } from "../core/exec.js";
import { fileURLToPath } from "url";

export async function setConfig() {
  Promise.resolve(createLocalConfig())
    .then((x) => exec(x, writeLocalConfig))
    .then((x) => exec(x, writeVaultConfig));
}

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const initMessage = `
First tell us where you want your config directory and snippets stored.
If you already have snippets directory, simply point to it.
`.trim();

export async function createLocalConfig(): Promise<{
  localConfig: LocalConfig;
}> {
  console.log(initMessage);
  const basePath = await promptUser(clc.white("Vault Path:\t"), getCwd());
  return { localConfig: { basePath } };
}

export function writeLocalConfig({
  localConfig,
}: {
  localConfig: LocalConfig;
}) {
  const localPetConfigPath = path.resolve(getLocalConfigPath(), "petConfig.js");
  createFileIfNotExists(localPetConfigPath);
  writeFromTemplate(
    path.resolve(__dirname, "petConfig.template"),
    localPetConfigPath,
    localConfig
  );
}

export function writeVaultConfig({
  localConfig,
}: {
  localConfig: LocalConfig;
}) {
  const dotPetPath = path.resolve(localConfig.basePath, ".pet");
  const configPath = path.resolve(dotPetPath, "config.mjs");
  if (fileExists(configPath)) {
    console.log(`${clc.white("Info:")}\t\tExisting config file found.`);
    return;
  }
  console.log(`${clc.white("Info:")}\t\tNew config file created.`);
  createDirectoryIfNotExists(dotPetPath);
  writeFromTemplate(
    path.resolve(__dirname, "vaultConfig.template"),
    configPath
  );
}
