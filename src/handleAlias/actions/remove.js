const shellsBulkWrite = require("../shells/shellsBulkWrite");
const { getAllAliases } = require("../helpers");
const getSourceRawConfigFile = require("../getSourceRawConfigFile");
const fs = require("fs");
const moduleExportsStr = require("../../util/moduleExportsStr");
const CommandError = require("../CommandError");
const parseArgvOptions = require("../../cmdArgs/parseArgvOptions");

// Need to find file path by alias name
function handleRemove(argv) {
  const { alias } = parseRemoveArgv(argv);
  const allAliases = getAllAliases();
  const aliasToRemove = allAliases.find((a) => a.alias === alias);
  if (!aliasToRemove) {
    throw new CommandError(`Alias "${alias}" not found.`);
  }
  const sourceConfigRaw = getSourceRawConfigFile(aliasToRemove.source);
  const updatedAliases = sourceConfigRaw.aliases.filter(
    (a) => a.alias !== alias
  );
  const { aliases, ...rest } = sourceConfigRaw;
  const updatedConfig =
    updatedAliases.length === 0 ? rest : { ...rest, aliases: updatedAliases };
  fs.writeFileSync(
    aliasToRemove.source.configAbsolutePath,
    moduleExportsStr(updatedConfig)
  );

  shellsBulkWrite();
  console.log(`Alias "${alias}" removed.`);
}

function parseRemoveArgv(argv) {
  return parseArgvOptions(
    [{ name: "alias", type: String, defaultOption: true }],
    argv
  );
}

module.exports = handleRemove;
