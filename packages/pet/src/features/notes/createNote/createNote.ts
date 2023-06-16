import { exec } from "../../../core/exec.js";
import { loadCoreConfigs } from "../../../core/config/loadCoreConfigs.js";
import { ArgvOptions } from "../../../cli/types.js";
import { notes } from "../Notes.js";
import { openNoteInTextEditor } from "./openNoteInTextEditor.js";
import { parseCreateArgv } from "./parseCreateArgv.js";
import { printMessage } from "./printMessage.js";
import { getNoteMetadata } from "./getNoteMetadata.js";

export async function createNote({ argv }: ArgvOptions) {
  return Promise.resolve({ ...notes.getMeta(), argv })
    .then((x) => exec(x, parseCreateArgv))
    .then((x) => exec(x, loadCoreConfigs))
    .then((x) => exec(x, getNoteMetadata<unknown>))
    .then((x) => exec(x, openNoteInTextEditor))
    .then((x) => printMessage(x));
}
