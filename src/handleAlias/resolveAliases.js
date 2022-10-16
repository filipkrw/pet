const { config } = require("../config");
const path = require("path");
const fs = require("fs");
const sourceConfig = require("../sourceConfig");

function resolveAliases(userConfig = config.userConfig, resolvedAliases = []) {
  const aliases = (userConfig.aliases || []).map((a) =>
    resolveAlias(a, userConfig)
  );
  const moreAliases = (userConfig.sources || []).reduce((acc, s) => {
    return resolveAliases(s, acc);
  }, aliases);
  return [...resolvedAliases, ...moreAliases];
}

function resolveAlias(alias, sourceConfig) {
  const aliasPath = path.join(sourceConfig.absolutePath, alias.relativePath);
  const aliasContent = fs.readFileSync(aliasPath, { encoding: "utf-8" });
  return {
    ...alias,
    absolutePath: aliasPath,
    content: aliasContent,
    // source: sourceConfig,
  };
}

module.exports = resolveAliases;
