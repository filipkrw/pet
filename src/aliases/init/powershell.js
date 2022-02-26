const path = require("path");
const fs = require("fs");
const { AliasesConfig, AliasNotFoundError } = require("../AliasesConfig");
const createFileIfNotExists = require("../util/createFileIfNotExists");
const util = require("util");
const removeDuplicates = require("../util/removeDuplicates");
const exec = util.promisify(require("child_process").exec);

async function init(basePath, dotPetPath) {
  const aliasesPath = path.join(dotPetPath, "aliases", "powershell.ps1");
  createFileIfNotExists(aliasesPath);

  await injectAliasesPathToPowershellProfile(aliasesPath);

  const configPath = path.join(dotPetPath, "aliases", "config.json");
  const config = new AliasesConfig(configPath);
  config.addShell("powershell");

  const aliases = config.getAliases();
  writeAliasesPowershell(basePath, aliases, aliasesPath);

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

function writeAliasesPowershell(basePath, aliases, aliasesPath) {
  const powershellFuncs = [];

  for (const [alias, source] of Object.entries(aliases)) {
    try {
      const snippetPath = path.join(basePath, source.snippet);
      const snippet = fs.readFileSync(snippetPath).toString();
      powershellFuncs.push(aliasToPowershell(alias, snippet));
    } catch (e) {
      continue;
    }
  }

  fs.writeFileSync(aliasesPath, powershellFuncs.join("\n\n"));
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

function aliasToPowershell(alias, snippet) {
  const params = [];
  let funcBody = snippet.replace(/(<[^>]*\*>)/g, "$args");
  funcBody = funcBody.replace(/(<[^>]*>)/g, (match) => {
    const param = `$${match.substr(1, match.length - 2).replace("-", "_")}`;
    params.push(param);
    return param;
  });
  const funcParams = params.filter(removeDuplicates).join(", ");
  const template = `function ${alias}(${funcParams}) {
			${funcBody}
	}`;
  return template;
}

module.exports = {
  init,
  aliasToPowershell,
};
