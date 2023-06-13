import handleArgvCommands from "../../cli/handleArgvCommands.js";
import { ArgvOptions } from "../../cli/types.js";
import { getConfig } from "./getConfig.js";
import { setConfig } from "./setConfig.js";

export async function handleConfig({ argv, subcommand }: ArgvOptions) {
  handleArgvCommands(
    [
      { commands: ["get", "g"], callback: getConfig },
      { commands: ["set", "s"], callback: setConfig },
    ],
    subcommand ? [subcommand, ...argv] : argv
  );
}
