import handleArgvCommands from "../../cmdArgs/handleArgvCommands.js";
import { ArgvOptions } from "../core/types.js";
import { getConfig } from "./getConfig.js";

export async function handleConfig({ argv, subcommand }: ArgvOptions) {
  handleArgvCommands(
    [
      { commands: ["get", "g"], callback: getConfig },
      // { commands: ["set", "s"], callback: handleInit },
    ],
    subcommand ? [subcommand, ...argv] : argv
  );
}
