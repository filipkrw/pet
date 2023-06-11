export type CommandCallback = (args: {
  argv: string[];
  subcommand?: string;
}) => Promise<void>;

export type CommandConfig = {
  commands: { base: string; short: string; subcommands?: string[] };
  callback: CommandCallback;
};

export type MatchedCommand = {
  callback: CommandCallback;
  subcommand?: string;
};
