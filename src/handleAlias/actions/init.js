const { config } = require("../../config");
const PowerShell = require("../shells/PowerShell");
const Bash = require("../shells/Bash");
const Zsh = require("../shells/Zsh/Zsh");
const CommandError = require("../CommandError");

async function handleInit() {
  if (config.platform === "win32") {
    const powerShell = new PowerShell();
    await powerShell.init();
  } else if (["linux", "darwin"].includes(config.platform)) {
    if (config.shell.indexOf("bash") > -1) {
      const bash = new Bash();
      bash.init();
    } else if (config.shell.indexOf("zsh") > -1) {
      const zsh = new Zsh();
      zsh.init();
    } else {
      throw new CommandError(`Shell "${config.shell}" not supported.`);
    }
  } else {
    throw new CommandError(`Platform "${config.platform}" not supported.`);
  }
}

module.exports = handleInit;
