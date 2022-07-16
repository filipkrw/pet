const { AliasesConfig } = require("../AliasesConfig");
const { getFileDetails } = require("../../config");
const path = require("path");
const fs = require("fs");
const CommandError = require("../CommandError");
const shellsBulkWrite = require("../shells/shellsBulkWrite");

function handleAdd([alias, snippetPath]) {
  const { source, relativePath, absolutePath } = getFileDetails(snippetPath);
  if (!fs.existsSync(absolutePath)) {
    throw new CommandError(`Snippet "${snippetPath}" doesn't exist.`);
  }
  const aliasesConfigPath = path.join(
    source.absolutePath,
    ".pet",
    "aliases.json"
  );
  const aliasesConfig = new AliasesConfig(aliasesConfigPath);
  aliasesConfig.addAlias(alias, relativePath);
  shellsBulkWrite(aliasesConfig);
  console.log(`Alias "${alias}" added.`);
}

module.exports = handleAdd;
