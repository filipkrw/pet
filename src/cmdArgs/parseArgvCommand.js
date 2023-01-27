import commandLineArgs from "command-line-args";
import { z } from "zod";

const argvSchema = z.object({
  command: z.string(),
  remainingArgv: z.array(z.string()),
});

function parseArgvCommand(argv) {
  const args = commandLineArgs([{ name: "command", defaultOption: true }], {
    stopAtFirstUnknown: true,
    argv, // Can be undefined
  });
  return argvSchema.parse({
    command: args.command,
    remainingArgv: args._unknown || [],
  });
}

export default parseArgvCommand;
