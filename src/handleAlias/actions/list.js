const sourceConfig = require("../../sourceConfig");
const clc = require("cli-color");

function handleList(args) {
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
