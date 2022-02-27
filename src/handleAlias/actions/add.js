const { AliasesConfig } = require("../AliasesConfig");
const { config } = require("../../config");
const path = require("path");
const fs = require("fs");
const CommandError = require("../CommandError");
const shellsBulkWrite = require("../shells/shellsBulkWrite");

function handleAdd([alias, snippetPath]) {
  const snippetFullPath = path.join(config.path.base, snippetPath);
  if (!fs.existsSync(snippetFullPath)) {
    throw new CommandError(`Snippet "${snippetPath}" doesn't exist.`);
  }

  const aliasesConfig = new AliasesConfig(config.path.aliases.config);
  aliasesConfig.addAlias(alias, snippetPath);
  shellsBulkWrite(aliasesConfig);
  console.log(`Alias "${alias}" added.`);
}

module.exports = handleAdd;
