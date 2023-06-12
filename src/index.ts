#!/usr/bin/env node
import { UnknownCommandError } from "./cli/UnknownCommandError.js";
import { handleArgvCommandsWithSubcommands } from "./cli/handleArgvCommandsWithSubcommands.js";
import { handleAliases } from "./features/aliases/index.js";
import { handleConfig } from "./features/config/index.js";
import { setConfig } from "./features/config/setConfig.js";
import { CommandError } from "./core/CommandError.js";
import { getIsInitialized } from "./core/config/getIsInitialized.js";
import { showHelp } from "./core/help/showHelp.js";
import { handleDailyNotes } from "./features/dailyNotes/index.js";
import { createNote } from "./features/notes/createNote/createNote.js";
import { findNotes } from "./features/notes/findNotes/findNotes.js";
import { removeNote } from "./features/notes/removeNote/removeNote.js";

async function pet() {
  const isInitialized = await getIsInitialized();
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
    ]);
  } catch (e) {
    if (e instanceof CommandError) {
      console.log(e.message);
    } else if (e instanceof UnknownCommandError) {
      showHelp();
    } else {
      throw e;
    }
  }
}

pet();
