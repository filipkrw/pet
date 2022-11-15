import parseArgvOptions from "../../cmdArgs/parseArgvOptions.js";
import { ArgvOptions } from "../types.js";

export type CreateArgs = {
  relativePath: string;
};

export function parseCreateArgv({ argv }: ArgvOptions): { args: CreateArgs } {
  const options = parseArgvOptions(
    [{ name: "relativePath", defaultOption: true }],
    argv
  );
  const { relativePath } = options;
  if (!relativePath) {
    throw new Error("Path is required");
  }
  return {
    args: {
      relativePath: relativePath as string,
    },
  };
}
