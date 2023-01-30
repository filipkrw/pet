import handleArgvCommands from "../../cmdArgs/handleArgvCommands.js";
import { ArgvOptions } from "../core/types";
import { createAlias } from "./createAlias/createAlias.js";
import { initAliases } from "./initAliases/initAliases.js";
import { removeAlias } from "./removeAlias/removeAlias.js";

export async function handleAliases({ argv, subcommand }: ArgvOptions) {
  handleArgvCommands(
    [
      { commands: ["init", "i"], callback: initAliases },
      { commands: ["create", "c"], callback: createAlias },
      { commands: ["remove", "r"], callback: removeAlias },
      // { commands: ["list", "l"], callback: handleList },
    ],
    subcommand ? [subcommand, ...argv] : argv
  );
}
