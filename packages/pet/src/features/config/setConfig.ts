import clc from "cli-color";
import path from "path";
import { fileURLToPath } from "url";
import {
  createDirectoryIfNotExists,
  createFileIfNotExists,
  fileExists,
} from "../../utils/files.js";
import getCwd from "../../utils/getCwd.js";
import promptUser from "../../utils/promptUser.js";
import { writeFromTemplate } from "../../utils/writeFromTemplate.js";
import { exec } from "../../core/exec.js";
import { getLocalConfigPath } from "../../core/config/getLocalConfigPath.js";
import { LocalConfig } from "../../core/types.js";

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

export async function writeLocalConfig({
  localConfig,
}: {
  localConfig: LocalConfig;
}) {
  const localPetConfigPath = path.resolve(getLocalConfigPath(), "petConfig.js");
  createFileIfNotExists(localPetConfigPath);
  await writeFromTemplate(
    path.resolve(__dirname, "templates/petConfig.template"),
    localPetConfigPath,
    localConfig
  );
}

export async function writeVaultConfig({
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
  await writeFromTemplate(
    path.resolve(__dirname, "templates/vaultConfig.template"),
    configPath
  );
}
