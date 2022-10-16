const handleInit = require("./actions/init");
const handleRemove = require("./actions/remove");
const handleAdd = require("./actions/add");
const handleList = require("./actions/list");
const CommandError = require("./CommandError");
const sourceConfig = require("../sourceConfig");
const aliasesResolver = require("../resolvers/aliasesResolver");
const parseArgvCommand = require("../cmdArgs/parseArgvCommand");

async function handleAlias(argv) {
  sourceConfig.resolve(aliasesResolver);
  const { command, remainingArgv } = parseArgvCommand(argv);

  if (command === "init") {
    await handleInit();
  } else if (command === "add") {
    handleAdd(remainingArgv);
  } else if (command === "remove") {
    handleRemove(remainingArgv);
  } else if (command === "list") {
    handleList(remainingArgv);
  }
}

module.exports = handleAlias;
