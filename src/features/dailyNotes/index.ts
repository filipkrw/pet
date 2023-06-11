import handleArgvCommands from "../../cli/handleArgvCommands.js";
import { ArgvOptions } from "../core/types";
import { createDailyNote } from "./createDailyNote/createDailyNote.js";
import { findDailyNotes } from "./findDailyNotes/findDailyNotes.js";

export async function handleDailyNotes({ argv, subcommand }: ArgvOptions) {
  handleArgvCommands(
    [
      { commands: ["create", "c"], callback: createDailyNote },
      { commands: ["find", "f"], callback: findDailyNotes },
    ],
    subcommand ? [subcommand, ...argv] : argv
  );
}
