import { z } from "zod";
import parseArgvOptions from "../../../cmdArgs/parseArgvOptions.js";
import { ArgvOptions } from "../../core/types.js";

export type DailyCreateArgs = z.infer<typeof schema>;

const schema = z.object({
  tags: z.array(z.string()).optional(),
  dirRelativePath: z.string().optional(),
});

export function parseDailyCreateArgv({ argv }: ArgvOptions) {
  const options = parseArgvOptions(
    [
      { name: "dirRelativePath", defaultOption: true },
      { name: "tags", alias: "t", type: String, multiple: true },
    ],
    argv
  );
  const { dirRelativePath, tags } = options;
  return {
    args: schema.parse({ dirRelativePath, tags }),
  };
}
