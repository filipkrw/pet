const sourceConfig = require("../../sourceConfig");
const clc = require("cli-color");
const fs = require("fs");
const path = require("path");

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

function handleList(args) {
  sourceConfig.resolve(aliasesResolver);
  const sourcesWithAliases = sourceConfig
    .getConfigFlat()
    .filter((source) => source.aliases);

  for (const source of sourcesWithAliases) {
    for (const alias of source.aliases) {
      console.log(
        `${clc.green.bold(alias.alias)} ${clc.green(
          `(${source.name}/${alias.relativePath})`
        )}`
      );
      if (args.verbose) {
        console.log(alias.content.trim());
        console.log();
      }
    }
  }

  const aliasesCount = sourcesWithAliases.reduce(
    (acc, source) => acc + source.aliases.length,
    0
  );
  console.log(
    clc.blue.bold(
      `${aliasesCount} alias${aliasesCount === 1 ? "" : "es"} found`
    )
  );
}

module.exports = handleList;
