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

function handleInit() {
  const aliasesConfig = new AliasesConfig(config.path.aliases.config);
  if (config.platform === "win32") {
    const powerShell = new PowerShell(aliasesConfig);
    powerShell.init();
  } else if (config.platform === "linux") {
    const bash = new Bash(aliasesConfig);
    bash.init();
  } else {
    console.log("OS not supported.");
  }
}

module.exports = handleInit;
