import { z } from "zod";
import parseArgvOptions from "../../../../cli/parseArgvOptions.js";
import { ArgvOptions } from "../../../../cli/types.js";

const schema = z.object({
  query: z.array(z.string()).length(2),
});

export function parseCreateAliasArgv({ argv }: ArgvOptions) {
  const args = parseArgvOptions(
    [{ name: "query", type: String, defaultOption: true, multiple: true }],
    argv
  );
  const parsedArgs = schema.parse(args);
  return {
    newAlias: {
      alias: parsedArgs.query[0],
      relativePath: parsedArgs.query[1],
    },
  };
}
