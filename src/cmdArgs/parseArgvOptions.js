import commandLineArgs from "command-line-args";

function parseArgvOptions(optionsDefinition, argv) {
  return commandLineArgs(optionsDefinition, { argv });
}

export default parseArgvOptions;
