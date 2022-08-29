const sourceConfig = require("../sourceConfig");

function getAllAliases() {
  return sourceConfig
    .getConfigFlat()
    .filter((s) => s.aliases)
    .flatMap((s) =>
      s.aliases.map((a) => ({
        source: {
          name: s.name,
          relativePath: s.relativePath,
          rootRelativePath: s.rootRelativePath,
          absolutePath: s.absolutePath,
          configAbsolutePath: s.configAbsolutePath,
        },
        ...a,
      }))
    );
}

module.exports = { getAllAliases };
