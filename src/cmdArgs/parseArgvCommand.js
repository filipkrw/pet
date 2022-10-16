const commandLineArgs = require("command-line-args");

function parseArgvCommand(argv) {
  const args = commandLineArgs([{ name: "command", defaultOption: true }], {
    stopAtFirstUnknown: true,
    argv, // Can be undefined
  });
  if (!args.command) {
    throw new Error("No command");
  }
  return {
    command: args.command,
    remainingArgv: args._unknown || [],
  };
}

module.exports = parseArgvCommand;
