import os from "os";
import path from "node:path";
import deepMerge from "./util/deepMerge.js";
import { fileExists, readJsonFile } from "./util/files.js";
import getRootPath from "./util/getRootPath.js";
import { importConfigFile } from "./util/importConfig.mjs";

async function initConfig() {
  let config = {
    path: await generatePaths(),
    localConfig: getLocalConfig(),
    platform: os.platform(),
    shell: process.env.SHELL,
  };

  function updateConfig(params) {
    config = deepMerge(config, params);
  }

  async function generatePaths() {
    const petConfig = await importConfigFile(
      path.join(getRootPath(), "localConfig/petConfig.js")
    );
    const base = path.normalize(petConfig.basePath);
    const dotPet = path.normalize(path.join(base, ".pet"));
    return { base, dotPet };
  }

  /**
   * Config local to the user's machine.
   */
  function getLocalConfig() {
    const localConfigAbsolutePath = path.normalize(
      path.join(getRootPath(), "localConfig")
    );
    const shellsAbsolutePath = path.join(
      localConfigAbsolutePath,
      "shells.json"
    );
    const shells = fileExists(shellsAbsolutePath)
      ? readJsonFile(shellsAbsolutePath)
      : [];
    return {
      absolutePath: localConfigAbsolutePath,
      shells: {
        absolutePath: shellsAbsolutePath,
        shells,
      },
      transformedAliases: {
        absolutePath: path.join(localConfigAbsolutePath, "transformedAliases"),
      },
      textEditor: "nano",
    };
  }

  return {
    config,
    updateConfig,
  };
}

export default await initConfig();
