import { VaultWithSubVaults } from "../../vault/types.js";
import { exec, execResolve } from "../exec.js";
import { loadConfigs } from "../loadConfigs/loadConfigs.js";
import { type ArgvOptions } from "../types.js";
import { parseFindArgv } from "./parseFindArgv.js";
import { printSearchResults } from "./printSeachResults.js";
import { readFiles } from "./readFiles.js";
import { searchFiles } from "./searchFiles.js";

export async function find({ argv }: ArgvOptions) {
  const config = await Promise.resolve(parseFindArgv({ argv })).then((x) =>
    exec(x, loadConfigs)
  );
  // const overrideFunction = getFindFlowOverrideFunction(config);
  // if (overrideFunction) {
  //   return overrideFunction(config);
  // }
  return Promise.resolve(config)
    .then((x) => execResolve(x, readFiles))
    .then((x) => exec(x, searchFiles))
    .then((x) => exec(x, printSearchResults));
}

function getFindFlowOverrideFunction(config: { vault: VaultWithSubVaults }) {
  if (!config.vault.plugins) {
    return;
  }
  const { plugins } = config.vault;
  const findFlowPlugin = plugins.find((x) => x.command === "find");
  if (findFlowPlugin) {
    return findFlowPlugin.flow;
  }
}
