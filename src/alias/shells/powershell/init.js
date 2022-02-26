const path = require("path");
const { AliasesConfig } = require("../../AliasesConfig");
const { config, updateConfig } = require("../../../config.js");
const createFileIfNotExists = require("../../util/createFileIfNotExists");
const {
  injectAliasesPathToPowershellProfile,
  writeAliasesPowershell,
} = require("./powershell");

async function initPowershell() {
  createFileIfNotExists(config.path.aliases.powershell);
  await injectAliasesPathToPowershellProfile();

  const aliasesConfig = new AliasesConfig(config.path.aliases.config);
  aliasesConfig.addShell("powershell");

  writeAliasesPowershell(aliasesConfig.getAliases());
}

module.exports = initPowershell;
