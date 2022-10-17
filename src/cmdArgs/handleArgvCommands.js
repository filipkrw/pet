const parseArgvCommand = require("./parseArgvCommand");

async function handleArgvCommands(commandsConfig, argv) {
  const { command, remainingArgv } = parseArgvCommand(argv);
  const { callback } = commandsConfig.find(({ commands }) =>
    commands.includes(command)
  );
  // In case callback is async
  await Promise.resolve(callback(remainingArgv));
}

module.exports = handleArgvCommands;
