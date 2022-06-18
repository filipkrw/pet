const path = require("path");
const fs = require("fs");
const os = require("os");
const { config } = require("../../../config.js");
const { createFileIfNotExists } = require("../../../util/files");
const Shell = require("../Shell.js");

class Zsh extends Shell {
  constructor(aliasesConfig) {
    super("zsh", "zsh_aliases", aliasesConfig);
  }

  async mount() {
    createFileIfNotExists(config.path.aliases[this.name]);

    try {
      const bashrcPath = path.join(os.homedir(), ".zshrc");
      const bashrc = fs.readFileSync(bashrcPath);
      const toInject = fs
        .readFileSync(path.join(__dirname, ".zshrc_template"))
        .toString()
        .replace(/{{aliasesPath}}/g, config.path.aliases[this.name]);
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

module.exports = Zsh;
