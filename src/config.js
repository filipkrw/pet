const os = require("os");
const path = require("path");
const petConfig = require("../localConfig/petConfig");
const deepMerge = require("./util/deepMerge");
const getRootPath = require("./util/getRootPath");

function initConfig() {
  let config = {
    path: generatePaths(),
    localConfig: getLocalConfig(),
    platform: os.platform(),
    shell: process.env.SHELL,
    textEditor: process.env.EDITOR || "nano",
    defaultExclude: [".pet", ".git"],
  };

  updateConfig({
    userConfig: getUserConfig(),
  });

  function updateConfig(params) {
    config = deepMerge(config, params);
  }

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
    return { ...userConfig, sources };
  }

  function resolveSourceConfig(source) {
    const name =
      source.name || path.basename(source.relativePath || source.absolutePath);
    const absolutePath =
      source.absolutePath ||
      path.resolve(config.path.dotPet, source.relativePath);
    const exclude = source.exclude || config.defaultExclude;
    return { ...source, name, absolutePath, exclude };
  }

  /**
   * Config local to the user's machine.
   */
  function getLocalConfig() {
    return {
      path: path.normalize(path.join(getRootPath(), "localConfig")),
    };
  }

  function getFileSource(filePath) {
    // TODO perhaps handle nested sources
    return config.userConfig.sources.find((source) => {
      return filePath.startsWith(source.name);
    });
  }

  function getFileDetails(filePath) {
    const source = getFileSource(filePath);
    const filePathNoSource = filePath.replace(
      new RegExp(`^${source.name}/`),
      ""
    );
    return {
      source,
      relativePath: filePathNoSource,
      absolutePath: path.join(source.absolutePath, filePathNoSource),
    };
  }

  return {
    config,
    updateConfig,
    getFileDetails,
  };
}

module.exports = initConfig();
