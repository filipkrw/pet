import { z } from "zod";
import parseArgvOptions from "../../cmdArgs/parseArgvOptions.js";
import { defaultArgvOptionsDefinition } from "../loadConfigs/defaultArgvOptionsDefinition.js";
import { ArgvOptions } from "../types.js";

export type DailyCreateArgs = z.infer<typeof dailyCreateArgsSchema>;

const dailyCreateArgsSchema = z.object({
  tags: z.array(z.string()).optional(),
  vault: z.string().optional(),
});

export function parseDailyCreateArgv({ argv }: ArgvOptions) {
  const options = parseArgvOptions(
    [
      ...defaultArgvOptionsDefinition,
      { name: "tags", alias: "t", type: String, multiple: true },
    ],
    argv
  );
  const { tags, vault } = options;
  return {
    args: dailyCreateArgsSchema.parse({ tags, vault }),
  };
}
