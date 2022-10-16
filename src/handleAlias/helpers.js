const config = require("../config");
const sourceConfig = require("../sourceConfig");

function getAllAliases() {
  return sourceConfig
    .getConfigFlat()
    .filter((s) => s.aliases)
    .flatMap((s) =>
      s.aliases.map((a) => ({
        source: {
          name: s.name,
          isRoot: s.isRoot,
          relativePath: s.relativePath,
          rootRelativePath: s.rootRelativePath,
          absolutePath: s.absolutePath,
          configAbsolutePath: s.configAbsolutePath,
        },
        ...a,
      }))
    );
}

function getShells() {
  return config.config.localConfig.shells.shells;
}

module.exports = { getAllAliases, getShells };
