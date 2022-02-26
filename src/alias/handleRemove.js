const { AliasesConfig } = require("./AliasesConfig");
const { config } = require("../config");
const { writeAliasesPowershell } = require("./shells/powershell/powershell");

function handleRemove(alias) {
  const aliasesConfig = new AliasesConfig(config.path.aliases.config);
  aliasesConfig.removeAlias(alias);
  propagate(aliasesConfig);
  console.log(`Alias "${alias}" removed.`);
}

function propagate(aliasesConfig) {
  const funcs = {
    powershell: writeAliasesPowershell,
  };
  for (const shell of aliasesConfig.getShells()) {
    const func = funcs[shell];
    if (!func) continue;
    func(aliasesConfig.getAliases());
  }
}

module.exports = handleRemove;
