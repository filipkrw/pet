import parseArgvOptions from "../../../cli/parseArgvOptions.js";
import { ArgvOptions } from "../../core/types.js";

export type FindArgs = {
  query: string;
};

export function parseFindArgv({ argv }: ArgvOptions): { args: FindArgs } {
  const options = parseArgvOptions(
    [{ name: "query", defaultOption: true, multiple: true }],
    argv
  );
  const { query } = options;
  return {
    args: {
      query: query?.join(" ") as string,
    },
  };
}
