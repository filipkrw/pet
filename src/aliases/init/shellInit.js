const path = require("path");
const fs = require("fs");
const { AliasesConfig, AliasNotFoundError } = require("../AliasesConfig");

function powershellInit(dotPetPath) {
  const configPath = path.join(dotPetPath, "aliases", "config.json");
  const aliasesPath = path.join(dotPetPath, "aliases", "powershell.ps1");

  const config = new AliasesConfig(configPath);
  config.addShell("bash");
  config.addShell("powershell");
  config.addAlias("echo", "misc/echo");
  config.addAlias("tunnel", "misc/localtunnel");

  try {
    config.removeAlias("test");
  } catch (e) {
    if (e instanceof AliasNotFoundError) {
      console.log(e.message);
      return;
    } else {
      throw e;
    }
  }
}

module.exports = {
  powershellInit,
};
