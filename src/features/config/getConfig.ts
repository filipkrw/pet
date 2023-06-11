import clc from "cli-color";
import { loadCoreConfigs } from "../core/loadConfigs/loadCoreConfigs.js";
import { LocalConfig } from "../core/types.js";

export async function getConfig() {
  Promise.resolve(loadCoreConfigs()).then(printConfig);
}

function printConfig({ localConfig }: { localConfig: LocalConfig }) {
  for (const [key, value] of Object.entries(localConfig)) {
    console.log(`${clc.white(`${camelCaseToCapitalized(key)}:`)}\t${value}`);
  }
}

function camelCaseToCapitalized(text: string) {
  return text.replace(/([A-Z])/g, " $1").replace(/^./, function (str) {
    return str.toUpperCase();
  });
}
