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
          absolutePath: s.absolutePath,
        },
        ...a,
      }))
    );
}

module.exports = { getAllAliases };
