const os = require("os");
const path = require("path");
const petConfig = require("../petConfig");
const deepMerge = require("./util/deepMerge");

function initConfig() {
  let config = {
    path: generatePaths(),
    platform: os.platform(),
    shell: process.env.SHELL,
  };

  function generatePaths() {
    const base = path.normalize(petConfig.basePath);
    const dotPet = path.normalize(path.join(base, ".pet"));
    return { base, dotPet };
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
