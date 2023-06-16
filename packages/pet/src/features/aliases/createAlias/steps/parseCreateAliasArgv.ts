import { z } from "zod";
import parseArgvOptions from "../../../../cli/parseArgvOptions.js";
import { ArgvOptions } from "../../../../cli/types.js";
import { Alias } from "../../schemas/aliasSchema.js";

const argsSchema = z.object({
  query: z.array(z.string()).min(2),
  inline: z.boolean().optional(),
  "no-subst": z.boolean().optional(),
});

export function parseCreateAliasArgv({ argv }: ArgvOptions): {
  newAlias: Alias;
} {
  const args = parseArgvOptions(
    [
      { name: "query", type: String, defaultOption: true, multiple: true },
      { name: "inline", type: Boolean, alias: "i" },
      { name: "no-subst", type: Boolean },
    ],
    argv
  );
  const parsedArgs = argsSchema.parse(args);

  const source: Alias["source"] = parsedArgs.inline
    ? {
        type: "inline",
        content: parsedArgs.query.slice(1).join(" "),
      }
    : {
        type: "note",
        relativePath: parsedArgs.query[1],
      };

  return {
    newAlias: {
      alias: parsedArgs.query[0],
      source,
      noVariableSubstitution: parsedArgs["no-subst"],
    },
  };
}
