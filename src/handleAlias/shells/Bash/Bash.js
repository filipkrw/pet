const path = require("path");
const fs = require("fs");
const os = require("os");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const { config, updateConfig } = require("../../../config.js");
const removeDuplicates = require("../../util/removeDuplicates.js");
const { AliasesConfig } = require("../../AliasesConfig");
const createFileIfNotExists = require("../../util/createFileIfNotExists");
const Shell = require("../Shell.js");

class Bash extends Shell {
  constructor(aliasesConfig) {
    super("bash", "bash_aliases", aliasesConfig);
  }

  async mount() {
    createFileIfNotExists(config.path.aliases.bash);

    try {
      const bashrcPath = path.join(os.homedir(), ".bashrc");
      const bashrc = fs.readFileSync(bashrcPath);
      const toInject = fs
        .readFileSync(path.join(__dirname, ".bashrc_template"))
        .toString()
        .replace(/{{bashAliasesPath}}/g, config.path.aliases.bash);
      if (bashrc.indexOf(toInject) === -1) {
        fs.writeFileSync(bashrcPath, toInject, {
          flag: "a+",
        });
      }
    } catch (e) {
      console.log(e.stderr || e);
    }
  }

  transform(alias, snippet) {
    const params = [];
    let funcBody = snippet.replace(/(<[^>|^\*]*>)/g, (match) => {
      const param = match.substr(1, match.length - 2).replace("-", "_");
      const indexInParams = params.findIndex((p) => p === param);
      if (indexInParams > -1) {
        return `$${indexInParams + 1}`;
      }
      params.push(param);
      return `$${params.length}`;
    });
    funcBody = funcBody.replace(/(<[^>]*\*>)/g, `$\{@:${params.length + 1}}`);
    const template = `
${alias}() {
	${funcBody}
}`;
    return template.trim();
  }
}

module.exports = Bash;
