const path = require("path");
const fs = require("fs");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const { config } = require("../../../config.js");
const removeDuplicates = require("../../util/removeDuplicates.js");

function writeAliasesPowershell(aliases) {
  const powershellFuncs = [];

  for (const [alias, source] of Object.entries(aliases)) {
    try {
      const snippetPath = path.join(config.path.base, source.snippet);
      const snippet = fs.readFileSync(snippetPath).toString();
      powershellFuncs.push(aliasToPowershell(alias, snippet));
    } catch (e) {
      continue;
    }
  }

  fs.writeFileSync(
    config.path.aliases.powershell,
    powershellFuncs.join("\n\n")
  );
}

async function injectAliasesPathToPowershellProfile() {
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
    const toInject = `\n. ${config.path.aliases.powershell}\n`;
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

module.exports = {
  writeAliasesPowershell,
  injectAliasesPathToPowershellProfile,
  aliasToPowershell,
};
