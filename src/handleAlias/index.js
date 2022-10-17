const handleInit = require("./actions/init");
const handleRemove = require("./actions/remove");
const handleAdd = require("./actions/add");
const handleList = require("./actions/list");
const sourceConfig = require("../sourceConfig");
const aliasesResolver = require("../resolvers/aliasesResolver");
const handleArgvCommands = require("../cmdArgs/handleArgvCommands");

async function handleAlias(argv, subcommand) {
  sourceConfig.resolve(aliasesResolver);
  handleArgvCommands(
    [
      { commands: ["init", "i"], callback: handleInit },
      { commands: ["add", "a"], callback: handleAdd },
      { commands: ["remove", "r"], callback: handleRemove },
      { commands: ["list", "l"], callback: handleList },
    ],
    subcommand ? [subcommand, ...argv] : argv
  );
}

module.exports = handleAlias;
