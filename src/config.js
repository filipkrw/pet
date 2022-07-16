const os = require("os");
const path = require("path");
const petConfig = require("../localConfig/petConfig");
const deepMerge = require("./util/deepMerge");
const getRootPath = require("./util/getRootPath");

function initConfig() {
  let config = {
    path: generatePaths(),
    userConfig: getUserConfig(),
    localConfig: getLocalConfig(),
    platform: os.platform(),
    shell: process.env.SHELL,
    textEditor: process.env.EDITOR || "nano",
    defaultExclude: [".pet", ".git"],
  };

  function generatePaths() {
    const base = path.normalize(petConfig.basePath);
    const dotPet = path.normalize(path.join(base, ".pet"));
    return { base, dotPet };
  }

  function getUserConfig() {
    const basePath = petConfig.basePath;
    const userConfig = require(path.join(basePath, ".pet", "config.js"));
    const sources = (userConfig.sources || []).map(resolveSourceConfig);
    // TODO deal with duplicates
    // TODO get absolutePath and exlude paths here
    return { ...userConfig, sources };
  }

  /**
   * Config local to the user's machine.
   */
  function getLocalConfig() {
    return {
      path: path.normalize(path.join(getRootPath(), "localConfig")),
    };
  }

  function resolveSourceConfig(source) {
    if (source.name) {
      return source;
    }
    const name = path.basename(source.relativePath || source.absolutePath);
    return { ...source, name };
  }

  function updateConfig(params) {
    config = deepMerge(config, params);
  }

  return {
    config,
    updateConfig,
  };
}

module.exports = initConfig();
