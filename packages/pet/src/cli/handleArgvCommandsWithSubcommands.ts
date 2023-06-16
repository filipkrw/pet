import { UnknownCommandError } from "./UnknownCommandError.js";
import parseArgvCommand from "./parseArgvCommand.js";
import { CommandConfig, MatchedCommand } from "./types.js";

export async function handleArgvCommandsWithSubcommands(
  commandsConfig: CommandConfig[],
  argv?: string[]
) {
  const { command, remainingArgv } = parseArgvCommand(argv);

  if (!command) {
    throw new UnknownCommandError();
  }

  const matchedCommand = matchCommand(commandsConfig, command);

  if (!matchedCommand) {
    throw new UnknownCommandError();
  }

  // Handle sync and async callbacks
  await Promise.resolve(
    matchedCommand.callback({
      argv: remainingArgv,
      subcommand: matchedCommand.subcommand,
    })
  );
}

function matchCommand(
  commandsConfig: CommandConfig[],
  command: string
): MatchedCommand | undefined {
  for (const { commands, callback } of commandsConfig) {
    if (command === commands?.base || command === commands?.short) {
      return { callback };
    }
    const subcommand = matchSubcommand(command, commands);
    if (subcommand) {
      return { callback, subcommand };
    }
  }
}

function matchSubcommand(command: string, commands: CommandConfig["commands"]) {
  if (!commands?.subcommands) {
    return;
  }
  for (const subcommand of commands.subcommands) {
    if (command === `${commands.short}${subcommand}`) {
      return subcommand;
    }
  }
}
