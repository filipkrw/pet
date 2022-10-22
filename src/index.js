#!/usr/bin/env node
import CommandError from "./handleAlias/CommandError.js";
import handleArgvCommandsWithSubcommands from "./cmdArgs/handleArgvCommandsWithSubcommands.js";
import {
  checkIsInitialized,
  handleInit,
  handleConfig,
} from "./handleInit/index.js";

async function pet() {
  const isInitialized = await checkIsInitialized();
  if (!isInitialized) {
    await handleInit();
    return;
  }

  try {
    const { default: handleFind } = await import("./handleFind.js");
    const { default: handleAlias } = await import("./handleAlias/index.js");
    const { default: handleCreate } = await import("./handleCreate/index.js");
    const { default: handleRemove } = await import("./handleRemove.js");
    const { default: handleHelp } = await import("./handleHelp/index.js");

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
