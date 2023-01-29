#!/usr/bin/env node
import handleArgvCommandsWithSubcommands from "./cmdArgs/handleArgvCommandsWithSubcommands.js";
import { aliases } from "./features/aliases/index.js";
import { createDailyNote } from "./features/dailyNotes/createDailyNote/createDailyNote.js";
import { createNote } from "./features/notes/createNote/createNote.js";
import { findNotes } from "./features/notes/findNotes/findNotes.js";
import CommandError from "./legacy/handleAlias/CommandError.js";
import { checkIsInitialized, handleInit } from "./legacy/handleInit/index.js";

async function pet() {
  const isInitialized = await checkIsInitialized();
  if (!isInitialized) {
    await handleInit();
    return;
  }

  try {
    handleArgvCommandsWithSubcommands([
      { commands: { base: "find", short: "f" }, callback: findNotes },
      { commands: { base: "create", short: "c" }, callback: createNote },
      { commands: { base: "daily", short: "d" }, callback: createDailyNote },
      // { commands: { base: "remove", short: "r" }, callback: handleRemove },
      {
        commands: {
          base: "alias",
          short: "a",
          subcommands: ["i", "l", "a", "r"],
        },
        callback: aliases,
      },
      // {
      //   commands: { base: "config", short: "cf", subcommands: ["g", "s"] },
      //   callback: handleConfig,
      // },
      // { isDefault: true, callback: handleHelp },
    ]);
  } catch (e) {
    if (e instanceof CommandError) {
      console.log(e.message);
    } else {
      throw e;
    }
  }
}

pet();
