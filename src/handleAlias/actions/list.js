const { AliasesConfig } = require("../AliasesConfig");
const { config } = require("../../config");
const clc = require("cli-color");
const fs = require("fs");
const path = require("path");

function handleList(args) {
  const aliasesConfig = new AliasesConfig(config.path.aliases.config);
  const aliases = Object.entries(aliasesConfig.getAliases());
  for (const [alias, source] of aliases) {
    console.log(`${clc.green.bold(alias)} ${clc.green(`(${source.snippet})`)}`);
    if (args.verbose) {
      const content = fs.readFileSync(
        path.join(config.path.base, source.snippet),
        "utf8"
      );
      console.log(content.trim());
      console.log();
    }
  }
  console.log(
    clc.blue.bold(
      `${aliases.length} alias${aliases.length === 1 ? "" : "es"} found`
    )
  );
}

module.exports = handleList;
