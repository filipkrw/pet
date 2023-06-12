import { z } from "zod";
import parseArgvOptions from "../../../../cli/parseArgvOptions.js";
import { ArgvOptions } from "../../../../cli/types.js";
import { Alias } from "../../schemas/aliasSchema.js";

const schema = z.object({
  query: z.array(z.string()).length(2),
  "no-subst": z.boolean().optional(),
});

export function parseCreateAliasArgv({ argv }: ArgvOptions): {
  newAlias: Alias;
} {
  const args = parseArgvOptions(
    [
      { name: "query", type: String, defaultOption: true, multiple: true },
      { name: "no-subst", type: Boolean },
    ],
    argv
  );
  const parsedArgs = schema.parse(args);
  return {
    newAlias: {
      alias: parsedArgs.query[0],
      relativePath: parsedArgs.query[1],
      noVariableSubstitution: parsedArgs["no-subst"],
    },
  };
}
