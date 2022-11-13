import parseArgvOptions from "../cmdArgs/parseArgvOptions.js";
import { ArgvOptions } from "./types.js";

export type ParseFindArgvResult = {
  args: {
    query: string;
  };
};

export function parseFindArgv({ argv }: ArgvOptions): ParseFindArgvResult {
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
