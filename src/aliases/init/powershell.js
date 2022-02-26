const path = require("path");
const fs = require("fs");
const { AliasesConfig, AliasNotFoundError } = require("../AliasesConfig");
const createFileIfNotExists = require("../util/createFileIfNotExists");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

async function init(dotPetPath) {
  const aliasesPath = path.join(dotPetPath, "aliases", "powershell.ps1");
  await injectAliasesPathToPowershellProfile(aliasesPath);
  createFileIfNotExists(aliasesPath);

  // if any aliases in config, transform them

  // const aliasesPath = path.join(dotPetPath, "aliases", "powershell.ps1");
  // createFileIfNotExists(aliasesPath);
  // const configPath = path.join(dotPetPath, "aliases", "config.json");
  // const config = new AliasesConfig(configPath);
  // try {
  //   config.removeAlias("test");
  // } catch (e) {
  //   if (e instanceof AliasNotFoundError) {
  //     console.log(e.message);
  //     return;
  //   } else {
  //     throw e;
  //   }
  // }
}

async function injectAliasesPathToPowershellProfile(aliasesPath) {
  const command = `
		if (!(Test-Path $Profile)) {
				New-Item -Type file -Path $Profile -Force
		}
		$Profile
	`;

  try {
    // Get path of powershell profile file
    // https://www.red-gate.com/simple-talk/sysadmin/powershell/persistent-powershell-the-powershell-profile/
    const { stdout } = await exec(command, { shell: "powershell" });
    const profilePath = stdout.trim();

    // Inject aliases path if not there already
    const profile = fs.readFileSync(profilePath);
    const toInject = `\n. ${aliasesPath}\n`;
    if (profile.indexOf(toInject) === -1) {
      fs.writeFileSync(profilePath.trim(), toInject, {
        flag: "a+",
      });
    }
  } catch (e) {
    console.log(e.stderr || e);
  }
}

module.exports = {
  init,
};
