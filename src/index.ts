#!/usr/bin/env node
import { handleArgvCommandsWithSubcommands } from "./cmdArgs/handleArgvCommandsWithSubcommands.js";
import { handleAliases } from "./features/aliases/index.js";
import { handleConfig } from "./features/config/index.js";
import { setConfig } from "./features/config/setConfig.js";
import { CommandError } from "./features/core/CommandError.js";
import { checkIsInitialized } from "./features/core/checkIsInitialized.js";
import { handleHelp } from "./features/core/help/handleHelp.js";
import { handleDailyNotes } from "./features/dailyNotes/index.js";
import { createNote } from "./features/notes/createNote/createNote.js";
import { findNotes } from "./features/notes/findNotes/findNotes.js";
import { removeNote } from "./features/notes/removeNote/removeNote.js";

async function pet() {
  const isInitialized = await checkIsInitialized();
  if (!isInitialized) {
    await setConfig();
    return;
  }

  try {
    await handleArgvCommandsWithSubcommands([
      { commands: { base: "find", short: "f" }, callback: findNotes },
      { commands: { base: "create", short: "c" }, callback: createNote },
      {
        commands: { base: "daily", short: "d", subcommands: ["c", "f"] },
        callback: handleDailyNotes,
      },
      { commands: { base: "remove", short: "r" }, callback: removeNote },
      {
        commands: {
          base: "alias",
          short: "a",
          subcommands: ["i", "l", "r", "c"],
        },
        callback: handleAliases,
      },
      {
        commands: { base: "config", short: "cf", subcommands: ["g", "s"] },
        callback: handleConfig,
      },
      { isDefault: true, callback: handleHelp },
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
