const clc = require("cli-color");
const { getAllAliases } = require("../helpers");

function handleList(args) {
  const aliases = getAllAliases().sort((a, b) =>
    a.alias.localeCompare(b.alias)
  );

  for (const alias of aliases) {
    console.log(
      `${clc.green.bold(alias.alias)} ${clc.green(`(${alias.relativePath})`)}`
    );
    if (args.verbose) {
      console.log(alias.content.trim());
      console.log();
    }
  }

  const aliasesCount = aliases.length;
  console.log(
    clc.blue.bold(
      `${aliasesCount} alias${aliasesCount === 1 ? "" : "es"} found`
    )
  );
}

module.exports = handleList;
