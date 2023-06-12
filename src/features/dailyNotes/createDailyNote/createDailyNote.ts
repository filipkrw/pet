import { exec } from "../../../core/exec.js";
import { loadCoreConfigs } from "../../../core/config/loadCoreConfigs.js";
import { type ArgvOptions } from "../../../core/types.js";
import { openEditor } from "../../notes/createNote/openEditor.js";
import { printMessage } from "../../notes/createNote/printMessage.js";
import { dailyNotes } from "../DailyNotes.js";
import { createDailyFile } from "./createFileWithFronmatter.js";
import { deleteFileIfEmpty } from "./deleteFileIfEmpty.js";
import { parseDailyCreateArgv } from "./parseCreateDailyNoteArgv.js";

export async function createDailyNote({ argv }: ArgvOptions) {
  return Promise.resolve({ ...dailyNotes.getMeta(), argv })
    .then((x) => exec(x, parseDailyCreateArgv))
    .then((x) => exec(x, loadCoreConfigs))
    .then((x) => exec(x, createDailyFile))
    .then((x) => exec(x, openEditor))
    .then((x) => exec(x, deleteFileIfEmpty))
    .then((x) => printMessage(x));
}
