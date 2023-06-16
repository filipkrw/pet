import { z } from "zod";
import parseArgvOptions from "../../../../cli/parseArgvOptions.js";
import { ArgvOptions } from "../../../../cli/types.js";

const schema = z.object({
  query: z.string(),
});

export function parseDeleteAliasArgv({ argv }: ArgvOptions) {
  const args = parseArgvOptions(
    [{ name: "query", type: String, defaultOption: true }],
    argv
  );
  const parsedArgs = schema.parse(args);
  return {
    aliasToRemove: parsedArgs.query,
  };
}
