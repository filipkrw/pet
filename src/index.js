#!/usr/bin/env node
import CommandError from "./handleAlias/CommandError.js";
import handleArgvCommandsWithSubcommands from "./cmdArgs/handleArgvCommandsWithSubcommands.js";
import { isInitialized, handleInit, handleConfig } from "./handleInit/index.js";
import handleFind from "./handleFind.js";
import handleAlias from "./handleAlias/index.js";
import handleCreate from "./handleCreate/index.js";
import handleRemove from "./handleRemove.js";
import handleHelp from "./handleHelp/index.js";

async function pet() {
  if (!isInitialized()) {
    await handleInit();
    return;
  }

  try {
    handleArgvCommandsWithSubcommands([
      { commands: { base: "find", short: "f" }, callback: handleFind },
      { commands: { base: "create", short: "c" }, callback: handleCreate },
      { commands: { base: "remove", short: "r" }, callback: handleRemove },
      {
        commands: {
          base: "alias",
          short: "a",
          subcommands: ["i", "l", "a", "r"],
        },
        callback: handleAlias,
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
