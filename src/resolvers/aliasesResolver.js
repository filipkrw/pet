const path = require("path");
const fs = require("fs");

function resolveAlias(alias, source) {
  const absolutePath = path.join(source.absolutePath, alias.relativePath);
  const content = fs.readFileSync(absolutePath, "utf8");
  return { ...alias, absolutePath, content };
}

/**
 * Resolves absolutePath and content for aliases in a source.
 */
function aliasesResolver(source) {
  if (!source.aliases) {
    return source;
  }
  const aliases = source.aliases.map((alias) => resolveAlias(alias, source));
  return { ...source, aliases };
}

module.exports = aliasesResolver;
