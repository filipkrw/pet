import parseArgvCommand from "./parseArgvCommand.js";

async function handleArgvCommands(commandsConfig, argv) {
  const { command, remainingArgv } = parseArgvCommand(argv);
  const { callback } = commandsConfig.find(({ commands }) =>
    commands.includes(command)
  );
  // Handle sync and async callbacks
  await Promise.resolve(callback(remainingArgv));
}

export default handleArgvCommands;
