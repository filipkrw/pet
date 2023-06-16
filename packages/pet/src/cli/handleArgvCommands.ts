import { UnknownCommandError } from "./UnknownCommandError.js";
import parseArgvCommand from "./parseArgvCommand.js";
import { CommandCallback } from "./types.js";

async function handleArgvCommands(
  commandsConfig: {
    commands: string[];
    callback: CommandCallback;
  }[],
  argv: string[]
) {
  const { command, remainingArgv } = parseArgvCommand(argv);

  if (!command) {
    throw new UnknownCommandError();
  }

  const matchedCommand = commandsConfig.find(({ commands }) =>
    commands.includes(command)
  );

  if (!matchedCommand) {
    throw new UnknownCommandError();
  }

  // Handle sync and async callbacks
  await Promise.resolve(matchedCommand.callback({ argv: remainingArgv }));
}

export default handleArgvCommands;
