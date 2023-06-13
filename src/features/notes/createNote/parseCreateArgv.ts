import parseArgvOptions from "../../../cli/parseArgvOptions.js";
import { ArgvOptions } from "../../../cli/types.js";
import { PetError } from "../../../core/PetError.js";

export type CreateArgs = {
  relativePath: string;
};

export const createArgvOptionsDefinition = [
  { name: "relativePath", defaultOption: true },
];

export function parseCreateArgv({ argv }: ArgvOptions): { args: CreateArgs } {
  const options = parseArgvOptions(createArgvOptionsDefinition, argv);
  const { relativePath } = options;
  if (!relativePath) {
    throw new PetError("Path is required");
  }
  return {
    args: {
      relativePath: relativePath as string,
    },
  };
}
