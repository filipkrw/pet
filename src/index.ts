#!/usr/bin/env node
import handleArgvCommandsWithSubcommands from "./cmdArgs/handleArgvCommandsWithSubcommands.js";
import { aliases } from "./features/aliases/aliases.js";
import { create } from "./features/core/create/create.js";
import { daily } from "./features/daily/daily.js";
import { find } from "./features/core/find/find.js";
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
      { commands: { base: "find", short: "f" }, callback: find },
      { commands: { base: "create", short: "c" }, callback: create },
      { commands: { base: "daily", short: "d" }, callback: daily },
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
