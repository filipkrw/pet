import parseArgvOptions from "../../cmdArgs/parseArgvOptions.js";
import { defaultArgvOptionsDefinition } from "../loadConfigs/defaultArgvOptionsDefinition.js";
import { ArgvOptions } from "../types.js";

export type DailyCreateArgs = {
  tags: string[];
  vault?: string;
};

export function parseDailyCreateArgv({ argv }: ArgvOptions): {
  args: DailyCreateArgs;
} {
  const options = parseArgvOptions(
    [
      ...defaultArgvOptionsDefinition,
      { name: "tags", alias: "t", type: String, multiple: true },
    ],
    argv
  );
  const { tags, vault } = options;
  return {
    args: {
      tags: (tags || []) as string[],
      vault: vault as string | undefined,
    },
  };
}
