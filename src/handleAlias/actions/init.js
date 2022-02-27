const fs = require("fs");
const path = require("path");
const os = require("os");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const clc = require("cli-color");
const { config, updateConfig } = require("../../config");
const PowerShell = require("../shells/PowerShell");
const Bash = require("../shells/Bash");
const { AliasesConfig } = require("../AliasesConfig");
const CommandError = require("../CommandError");
const Zsh = require("../shells/Zsh/Zsh");

function handleInit() {
  const aliasesConfig = new AliasesConfig(config.path.aliases.config);

  if (config.platform === "win32") {
    const powerShell = new PowerShell(aliasesConfig);
    powerShell.init();
  } else if (["linux", "darwin"].includes(config.platform)) {
    if (config.shell.indexOf("bash") > -1) {
      const bash = new Bash(aliasesConfig);
      bash.init();
    } else if (config.shell.indexOf("zsh") > -1) {
      const zsh = new Zsh(aliasesConfig);
      zsh.init();
    } else {
      throw new CommandError(`Shell "${config.shell}" not supported.`);
    }
  } else {
    throw new CommandError(`Platform "${config.platform}" not supported.`);
  }
}

module.exports = handleInit;
