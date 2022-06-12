#!/usr/bin/env node
const { isInitialized, handleInit } = require("./handleInit");

async function pet() {
  if (!isInitialized()) {
    await handleInit();
    return;
  }

  const commandLineArgs = require("command-line-args");
  const handleAlias = require("./handleAlias");
  const handleQuery = require("./handleQuery");
  const handleRun = require("./handleRun");
  const CommandError = require("./handleAlias/CommandError");

  const args = commandLineArgs([
    { name: "query", type: String, defaultOption: true, multiple: true },
    { name: "namesOnly", alias: "n", type: Boolean },
    { name: "alias", alias: "a", type: String, multiple: true },
    { name: "remove", alias: "r", type: Boolean },
    { name: "exec", alias: "e", type: String, multiple: true },
    { name: "list", alias: "l", type: Boolean },
    { name: "verbose", alias: "v", type: Boolean },
  ]);

  try {
    if (args.exec) handleRun(args);
    else if (args.alias) handleAlias(args);
    else if (args.query) handleQuery(args);
  } catch (e) {
    if (e instanceof CommandError) {
      console.log(e.message);
    } else {
      throw e;
    }
  }
}

pet();
