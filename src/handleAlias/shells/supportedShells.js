const Bash = require("./Bash");
const PowerShell = require("./PowerShell");
const Zsh = require("./Zsh/Zsh");

module.exports = {
  powershell: PowerShell,
  bash: Bash,
  zsh: Zsh,
};
