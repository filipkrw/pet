import handleArgvCommands from "../../cmdArgs/handleArgvCommands.js";
import { ArgvOptions } from "../core/types";
import { initAliases } from "./initAliases/initAliases.js";

export async function aliases({ argv, subcommand }: ArgvOptions) {
  handleArgvCommands(
    [
      { commands: ["init", "i"], callback: initAliases },
      // { commands: ["add", "a"], callback: handleAdd },
      // { commands: ["remove", "r"], callback: handleRemove },
      // { commands: ["list", "l"], callback: handleList },
    ],
    subcommand ? [subcommand, ...argv] : argv
  );
}
