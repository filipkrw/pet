#!/usr/bin/env node
const CommandError = require("./handleAlias/CommandError");
const handleArgvCommands = require("./cmdArgs/handleArgvCommands");
const { isInitialized, handleInit, handleConfig } = require("./handleInit");
const { DEFAULT } = require("./constants");

async function pet() {
  if (!isInitialized()) {
    await handleInit();
    return;
  }

  const handleFind = require("./handleFind");
  const handleAlias = require("./handleAlias");
  const handleCreate = require("./handleCreate");
  const handleRemove = require("./handleRemove");
  const handleHelp = require("./handleHelp/handleHelp");

  try {
    handleArgvCommands([
      { commands: ["find", "f"], callback: handleFind },
      { commands: ["create", "c"], callback: handleCreate },
      { commands: ["remove", "r"], callback: handleRemove },
      { commands: ["alias", "a"], callback: handleAlias },
      { commands: ["config"], callback: handleConfig },
      { commands: [DEFAULT], callback: handleHelp },
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
