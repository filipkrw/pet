const { AliasesConfig } = require("../AliasesConfig");
const { config } = require("../../config");
const shellsBulkWrite = require("../shells/shellsBulkWrite");

// Need to find file path by alias name
function handleRemove(alias) {
  const aliasesConfig = new AliasesConfig(config.path.aliases.config);
  aliasesConfig.removeAlias(alias);
  shellsBulkWrite(aliasesConfig);
  console.log(`Alias "${alias}" removed.`);
}

module.exports = handleRemove;
