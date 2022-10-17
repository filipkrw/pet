#!/usr/bin/env node
const CommandError = require("./handleAlias/CommandError");
const handleArgvCommandsWithSubcommands = require("./cmdArgs/handleArgvCommandsWithSubcommands");
const { isInitialized, handleInit, handleConfig } = require("./handleInit");

async function pet() {
  if (!isInitialized()) {
    await handleInit();
    return;
  }

  const handleFind = require("./handleFind");
  const handleAlias = require("./handleAlias");
  const handleCreate = require("./handleCreate");
  const handleRemove = require("./handleRemove");
  const handleHelp = require("./handleHelp");

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
