import pprint from "../util/pprint.js";
import { exec } from "./exec.js";
import { parseFindArgv } from "./parseFindArgv.js";
import { readLocalConfig } from "./readLocalConfig.js";
import { readVaultConfig } from "./readVaultConfig.js";
import { type ArgvOptions } from "./types.js";

export function runFindFlow({ argv }: ArgvOptions) {
  return Promise.resolve({ argv })
    .then((x) => exec(x, parseFindArgv))
    .then((x) => exec(x, readLocalConfig))
    .then((x) => exec(x, readVaultConfig))
    .then((x) => console.log(pprint(x)));
}