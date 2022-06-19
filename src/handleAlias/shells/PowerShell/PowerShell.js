const fs = require("fs");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const { config } = require("../../../config.js");
const removeDuplicates = require("../../../util/removeDuplicates.js");
const { createFileIfNotExists } = require("../../../util/files");
const Shell = require("../Shell.js");

class PowerShell extends Shell {
  constructor(aliasesConfig) {
    super("powershell", "PowerShell_aliases.ps1", aliasesConfig);
  }

  async mount() {
    createFileIfNotExists(config.path.aliases[this.name]);

    try {
      // Get path of PowerShell profile file
      // https://www.red-gate.com/simple-talk/sysadmin/powerShell/persistent-powerShell-the-powerShell-profile/
      const command = `
        if (!(Test-Path $Profile)) {
            New-Item -Type file -Path $Profile -Force
        }
        $Profile
      `;

      const { stdout } = await exec(command, { shell: "powerShell" });
      const profilePath = stdout.trim();
      createFileIfNotExists(profilePath);

      // Inject aliases path if not there already
      const profile = fs.readFileSync(profilePath);
      const toInject = `\n. ${config.path.aliases[this.name]}\n`;
      if (profile.indexOf(toInject) === -1) {
        fs.writeFileSync(profilePath.trim(), toInject, {
          flag: "a+",
        });
      }
    } catch (e) {
      console.log(e.stderr || e);
    }
  }

  transform(alias, snippet) {
    const params = [];
    let funcBody = snippet.replace(/(<[^>]*\*>)/g, "$($args)");
    funcBody = funcBody.replace(/(<[^>]*>)/g, (match) => {
      const param = `$${match.substr(1, match.length - 2).replace(/-/g, "_")}`;
      params.push(param);
      return `$(${param})`;
    });
    const funcParams = params.filter(removeDuplicates).join(", ");
    const template = `
function ${alias}(${funcParams}) {
  $expr = "${funcBody}"
  Invoke-Expression $expr
}`;
    return template.trim();
  }
}

module.exports = PowerShell;
