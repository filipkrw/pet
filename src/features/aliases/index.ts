import handleArgvCommands from "../../cmdArgs/handleArgvCommands.js";
import { ArgvOptions } from "../core/types";
import { createAlias } from "./createAlias/createAlias.js";
import { initAliases } from "./initAliases/initAliases.js";

export async function aliases({ argv, subcommand }: ArgvOptions) {
  handleArgvCommands(
    [
      { commands: ["init", "i"], callback: initAliases },
      { commands: ["create", "c"], callback: createAlias },
      // { commands: ["remove", "r"], callback: handleRemove },
      // { commands: ["list", "l"], callback: handleList },
    ],
    subcommand ? [subcommand, ...argv] : argv
  );
}
