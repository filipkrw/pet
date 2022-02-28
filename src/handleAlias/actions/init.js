const { config } = require("../../config");
const PowerShell = require("../shells/PowerShell");
const Bash = require("../shells/Bash");
const Zsh = require("../shells/Zsh/Zsh");
const { AliasesConfig } = require("../AliasesConfig");
const CommandError = require("../CommandError");

async function handleInit() {
  const aliasesConfig = new AliasesConfig(config.path.aliases.config);

  if (config.platform === "win32") {
    const powerShell = new PowerShell(aliasesConfig);
    await powerShell.init();
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
