import parseArgvCommand from "./parseArgvCommand.js";

export async function handleArgvCommandsWithSubcommands(commandsConfig, argv) {
  const { command, remainingArgv } = parseArgvCommand(argv);
  const { callback, subcommand } = matchCommand(command, commandsConfig);

  // Handle sync and async callbacks
  await Promise.resolve(
    callback({
      argv: remainingArgv,
      subcommand,
    })
  );
}

function matchCommand(command, commandsConfig) {
  for (const { isDefault, commands, callback } of commandsConfig) {
    if (isDefault || command === commands.base || command === commands.short) {
      return { callback };
    }
    const subcommand = findSubcommand(command, commands);
    if (subcommand) {
      return { callback, subcommand };
    }
  }
}

function findSubcommand(command, commands) {
  if (!commands.subcommands) {
    return;
  }
  for (const subcommand of commands.subcommands) {
    if (command === `${commands.short}${subcommand}`) {
      return subcommand;
    }
  }
}
