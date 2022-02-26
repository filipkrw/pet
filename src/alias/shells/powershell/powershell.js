const path = require("path");
const fs = require("fs");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const { config, updateConfig } = require("../../../config.js");
const removeDuplicates = require("../../util/removeDuplicates.js");
const { AliasesConfig } = require("../../AliasesConfig");
const createFileIfNotExists = require("../../util/createFileIfNotExists");

class PowerShell {
  constructor() {
    updateConfig({
      path: {
        aliases: {
          config: path.join(config.path.dotPet, "aliases", "config.json"),
          powerShell: path.join(
            config.path.dotPet,
            "aliases",
            "powerShell.ps1"
          ),
        },
      },
    });

    this.aliasesConfig = new AliasesConfig(config.path.aliases.config);
  }

  async init() {
    await this.mount();
    this.write();
    this.aliasesConfig.addShell("powerShell");
  }

  async mount() {
    createFileIfNotExists(config.path.aliases.powerShell);

    const command = `
      if (!(Test-Path $Profile)) {
          New-Item -Type file -Path $Profile -Force
      }
      $Profile
    `;

    try {
      // Get path of powerShell profile file
      // https://www.red-gate.com/simple-talk/sysadmin/powerShell/persistent-powerShell-the-powerShell-profile/
      const { stdout } = await exec(command, { shell: "powerShell" });
      const profilePath = stdout.trim();

      // Inject aliases path if not there already
      const profile = fs.readFileSync(profilePath);
      const toInject = `\n. ${config.path.aliases.powerShell}\n`;
      if (profile.indexOf(toInject) === -1) {
        fs.writeFileSync(profilePath.trim(), toInject, {
          flag: "a+",
        });
      }
    } catch (e) {
      console.log(e.stderr || e);
    }
  }

  write() {
    const aliases = this.aliasesConfig.getAliases();
    const powerShellFuncs = [];

    for (const [alias, source] of Object.entries(aliases)) {
      try {
        const snippetPath = path.join(config.path.base, source.snippet);
        const snippet = fs.readFileSync(snippetPath).toString();
        powerShellFuncs.push(this.transform(alias, snippet));
      } catch (e) {
        continue;
      }
    }
    fs.writeFileSync(
      config.path.aliases.powerShell,
      powerShellFuncs.join("\n\n")
    );
  }

  transform(alias, snippet) {
    const params = [];
    let funcBody = snippet.replace(/(<[^>]*\*>)/g, "$($args)");
    funcBody = funcBody.replace(/(<[^>]*>)/g, (match) => {
      const param = `$${match.substr(1, match.length - 2).replace("-", "_")}`;
      params.push(param);
      return `$(${param})`;
    });
    const funcParams = params.filter(removeDuplicates).join(", ");
    const template = `function ${alias}(${funcParams}) {
        $expr = "${funcBody}"
        Invoke-Expression $expr
    }`;
    return template;
  }
}

module.exports = PowerShell;
