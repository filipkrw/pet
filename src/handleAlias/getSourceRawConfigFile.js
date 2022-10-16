const { fileExists } = require("../util/files");

function getSourceRawConfigFile(source) {
  const configPath = source.configAbsolutePath;
  const config = fileExists(configPath) ? require(configPath) : {};
  return config;
}

module.exports = getSourceRawConfigFile;
