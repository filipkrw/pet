import { type ArgvOptions } from "../../../cli/types.js";
import { loadCoreConfigs } from "../../../core/config/loadCoreConfigs.js";
import { exec } from "../../../core/exec.js";
import { notes } from "../Notes.js";
import { parseFindArgv } from "./parseFindArgv.js";
import { printSearchResults } from "./printSeachResults.js";
import { readFiles } from "./readFiles.js";
import { searchFiles } from "./searchFiles.js";

export async function findNotes({ argv }: ArgvOptions) {
  return Promise.resolve({ ...notes.getMeta(), argv })
    .then((x) => exec(x, parseFindArgv))
    .then((x) => exec(x, loadCoreConfigs))
    .then((x) => exec(x, readFiles))
    .then((x) => exec(x, searchFiles))
    .then((x) => exec(x, printSearchResults));
}
