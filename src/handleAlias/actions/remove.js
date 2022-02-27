const { AliasesConfig } = require("../AliasesConfig");
const { config } = require("../../config");
const shellsBulkWrite = require("../shells/shellsBulkWrite");

function handleRemove(alias) {
  const aliasesConfig = new AliasesConfig(config.path.aliases.config);
  aliasesConfig.removeAlias(alias);
  shellsBulkWrite(aliasesConfig.getShells());
  console.log(`Alias "${alias}" removed.`);
}

module.exports = handleRemove;
