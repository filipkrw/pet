const os = require("os");
const path = require("path");
const petConfig = require("../petConfig");
const deepMerge = require("./util/deepMerge");

function initConfig() {
  let config = {
    path: generatePaths(),
    userConfig: getUserConfig(),
    platform: os.platform(),
    shell: process.env.SHELL,
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
    return userConfig;
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
