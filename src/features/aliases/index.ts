import handleArgvCommands from "../../cli/handleArgvCommands.js";
import { ArgvOptions } from "../core/types";
import { createAlias } from "./createAlias/createAlias.js";
import { initAliases } from "./initAliases/initAliases.js";
import { listAliases } from "./listAliases/listAliases.js";
import { removeAlias } from "./removeAlias/removeAlias.js";

export async function handleAliases({ argv, subcommand }: ArgvOptions) {
  handleArgvCommands(
    [
      { commands: ["init", "i"], callback: initAliases },
      { commands: ["create", "c"], callback: createAlias },
      { commands: ["remove", "r"], callback: removeAlias },
      { commands: ["list", "l"], callback: listAliases },
    ],
    subcommand ? [subcommand, ...argv] : argv
  );
}
