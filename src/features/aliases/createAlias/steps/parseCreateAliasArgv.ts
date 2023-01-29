import { z } from "zod";
import parseArgvOptions from "../../../../cmdArgs/parseArgvOptions.js";
import { ArgvOptions } from "../../../core/types.js";

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
    args: {
      alias: parsedArgs.query[0],
      noteRelativePath: parsedArgs.query[1],
    },
  };
}
