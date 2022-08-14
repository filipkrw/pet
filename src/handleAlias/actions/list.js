const { AliasesConfig } = require("../AliasesConfig");
const { config, resolve, configFlat } = require("../../sourceConfig");
const clc = require("cli-color");
const fs = require("fs");
const path = require("path");
const objToModuleExportsStr = require("../../util/objToModuleExportsStr");
const { log } = require("console");

function resolveAlias(alias, source) {
  const absolutePath = path.join(source.absolutePath, alias.relativePath);
  const content = fs.readFileSync(absolutePath, "utf8");
  return { ...alias, absolutePath, content };
}

function resolveAliases(source) {
  if (!source.aliases) {
    return source;
  }
  const aliases = source.aliases.map((alias) => resolveAlias(alias, source));
  return { ...source, aliases };
}

function handleList(args) {
  const resolvedConfigFlat = resolve(resolveAliases);
  const sourcesWithAliases = resolvedConfigFlat
    .flatMap((source) => source)
    .filter((source) => source.aliases);
  for (const source of sourcesWithAliases) {
    for (const alias of source.aliases) {
      console.log(
        `${clc.green.bold(alias.alias)} ${clc.green(`(${alias.relativePath})`)}`
      );
      if (args.verbose) {
        console.log(alias.content.trim());
        console.log();
      }
    }
  }
  // console.log(
  //   clc.blue.bold(
  //     `${aliases.length} alias${aliases.length === 1 ? "" : "es"} found`
  //   )
  // );
}

module.exports = handleList;
