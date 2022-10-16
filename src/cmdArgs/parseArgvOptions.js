const commandLineArgs = require("command-line-args");

function parseArgvOptions(optionsDefinition, argv) {
  return commandLineArgs(optionsDefinition, { argv });
}

module.exports = parseArgvOptions;
