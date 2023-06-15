import { type ArgvOptions } from "../../../cli/types.js";
import { loadCoreConfigs } from "../../../core/config/loadCoreConfigs.js";
import { exec } from "../../../core/exec.js";
import { openEditor } from "../../notes/createNote/openEditor.js";
import { printMessage } from "../../notes/createNote/printMessage.js";
import { dailyNotes } from "../DailyNotes.js";
import { createDailyFile } from "./createFileWithFronmatter.js";
import { deleteFileIfEmpty } from "./deleteFileIfEmpty.js";
import { getDailyNoteMetadata } from "./getDailyNoteMetadata.js";
import { parseDailyCreateArgv } from "./parseCreateDailyNoteArgv.js";

export async function createDailyNote({ argv }: ArgvOptions) {
  return Promise.resolve({ ...dailyNotes.getMeta(), argv })
    .then((x) => exec(x, parseDailyCreateArgv))
    .then((x) => exec(x, loadCoreConfigs))
    .then((x) => exec(x, getDailyNoteMetadata))
    .then((x) => exec(x, createDailyFile))
    .then((x) => exec(x, openEditor))
    .then((x) => exec(x, deleteFileIfEmpty))
    .then((x) => printMessage(x));
}
