#!/usr/bin/env node
const parseArgvCommand = require("./cmdArgs/parseArgvCommand");
const { isInitialized, handleInit, handleConfig } = require("./handleInit");

async function pet() {
  if (!isInitialized()) {
    await handleInit();
    return;
  }

  const handleAlias = require("./handleAlias");
  const handleQuery = require("./handleQuery");
  const handleCreate = require("./handleCreate");
  const CommandError = require("./handleAlias/CommandError");

  const { command, remainingArgv } = parseArgvCommand();

  try {
    if (command === "find") handleQuery(remainingArgv);
    else if (command === "new") handleCreate(remainingArgv);
    else if (command === "config") handleConfig(remainingArgv);
    else if (command === "alias") handleAlias(remainingArgv);
  } catch (e) {
    if (e instanceof CommandError) {
      console.log(e.message);
    } else {
      throw e;
    }
  }
}

pet();
