#!/usr/bin/env node
const commandLineArgs = require("command-line-args");
const handleAlias = require("./aliases/handleAlias.js");
const handleQuery = require("./handleQuery.js");
const handleRun = require("./handleRun.js");

const args = commandLineArgs([
  { name: "query", type: String, defaultOption: true, multiple: true },
  { name: "namesOnly", alias: "n", type: Boolean },
  { name: "alias", alias: "a", type: String, multiple: true },
  { name: "run", alias: "r", type: String, multiple: true },
]);

if (args.run) handleRun(args);
else if (args.alias) handleAlias(args);
else if (args.query) handleQuery(args);
