const os = require("os");
const path = require("path");
const userConfig = require("../userConfig");
const mergeDeep = require("./util/mergeDeep");

function initConfig() {
  let config = {
    path: generatePaths(),
    platform: os.platform(),
  };

  function generatePaths() {
    const base = path.normalize(parseBasePath(userConfig.basePath));
    const dotPet = path.normalize(path.join(base, ".pet"));
    return { base, dotPet };
  }

  function updateConfig(parameters) {
    config = mergeDeep(config, parameters);
  }

  return {
    config,
    updateConfig,
  };
}

function parseBasePath(basePath) {
  if (typeof basePath === "string") {
    return basePath;
  }
  const platform = os.platform();
  if (platform in basePath) {
    return basePath[platform];
  }
  throw new Error(
    `No basePath specified for the operating system: ${platform}`
  );
}

module.exports = initConfig();
