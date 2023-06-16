import commandLineArgs, { OptionDefinition } from "command-line-args";

function parseArgvOptions(
  optionDefinitions: OptionDefinition[],
  argv: string[]
) {
  return commandLineArgs(optionDefinitions, { argv });
}

export default parseArgvOptions;
