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

  const handleQuery = require("./handleQuery");
  const handleAlias = require("./handleAlias");
  const handleCreate = require("./handleCreate");
  const handleHelp = require("./handleHelp/handleHelp");

  try {
    handleArgvCommands([
      { commands: ["find", "f"], callback: handleQuery },
      { commands: ["create", "c"], callback: handleCreate },
      { commands: ["config"], callback: handleConfig },
      { commands: ["alias", "a"], callback: handleAlias },
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
