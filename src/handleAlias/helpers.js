const config = require("../config");
const filesResolver = require("../resolvers/filesResolver");
const sourceConfig = require("../sourceConfig");
const path = require("path");

function getAllAliases() {
  return sourceConfig
    .getConfigFlat()
    .filter((s) => s.aliases)
    .flatMap((s) =>
      s.aliases.map((a) => ({
        source: getSourceEmbeddedConfig(s),
        ...a,
      }))
    );
}

function getAllFiles() {
  sourceConfig.resolve(filesResolver);
  return sourceConfig.getConfigFlat().flatMap((s) =>
    s.files.map((f) => ({
      source: getSourceEmbeddedConfig(s),
      ...f,
    }))
  );
}

function getShells() {
  return config.config.localConfig.shells.shells;
}

function getSourceEmbeddedConfig(s) {
  return {
    name: s.name,
    isRoot: s.isRoot,
    relativePath: s.relativePath,
    rootRelativePath: s.rootRelativePath,
    absolutePath: s.absolutePath,
    configAbsolutePath: s.configAbsolutePath,
  };
}

function getFileRootRelativePath(file) {
  return path.join(file.source.rootRelativePath, file.relativePath);
}

function getFileAbsolutePath(file) {
  return path.join(file.source.absolutePath, file.relativePath);
}

module.exports = {
  getAllAliases,
  getShells,
  getAllFiles,
  getFileRootRelativePath,
  getFileAbsolutePath,
};
