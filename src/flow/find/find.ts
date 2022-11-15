import { exec, execResolve } from "../exec.js";
import { loadConfigs } from "../loadConfigs/loadConfigs.js";
import { type ArgvOptions } from "../types.js";
import { parseFindArgv } from "./parseFindArgv.js";
import { printFindResults } from "./printSeachResults.js";
import { readFiles } from "./readFiles.js";
import { searchFiles } from "./searchFiles.js";

export function find({ argv }: ArgvOptions) {
  return Promise.resolve(parseFindArgv({ argv }))
    .then((x) => exec(x, loadConfigs))
    .then((x) => execResolve(x, readFiles))
    .then((x) => exec(x, searchFiles))
    .then((x) => exec(x, printFindResults));
}
