const commandLineArgs = require("command-line-args");

function parseArgvCommand(argv) {
  const args = commandLineArgs([{ name: "command", defaultOption: true }], {
    stopAtFirstUnknown: true,
    argv, // Can be undefined
  });
  return {
    command: args.command,
    remainingArgv: args._unknown || [],
  };
}

module.exports = parseArgvCommand;
