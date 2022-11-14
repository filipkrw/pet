import { exec, execResolve } from "./exec.js";
import { parseFindArgv } from "./parseFindArgv.js";
import { printFindResults } from "./printSeachResults.js";
import { readFiles } from "./readFiles.js";
import { readLocalConfig } from "./readLocalConfig.js";
import { readVaultConfig } from "./readVaultConfig.js";
import { searchFiles } from "./searchFiles.js";
import { type ArgvOptions } from "./types.js";

export function runFindFlow({ argv }: ArgvOptions) {
  return Promise.resolve({ argv })
    .then((x) => exec(x, parseFindArgv))
    .then((x) => exec(x, readLocalConfig))
    .then((x) => exec(x, readVaultConfig))
    .then((x) => execResolve(x, readFiles))
    .then((x) => exec(x, searchFiles))
    .then((x) => exec(x, printFindResults));
}
