const path = require("path");
const fs = require("fs");
const os = require("os");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const { config, updateConfig } = require("../../../config.js");
const removeDuplicates = require("../../util/removeDuplicates.js");
const { AliasesConfig } = require("../../AliasesConfig");
const createFileIfNotExists = require("../../util/createFileIfNotExists");

class Bash {
  constructor() {
    updateConfig({
      path: {
        aliases: {
          config: path.join(config.path.dotPet, "aliases", "config.json"),
          bash: path.join(config.path.dotPet, "aliases", "transformed", "bash"),
        },
      },
    });
    this.aliasesConfig = new AliasesConfig(config.path.aliases.config);
  }

  async init() {
    await this.mount();
    this.write();
    this.aliasesConfig.addShell("bash");
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

  write() {
    const aliases = this.aliasesConfig.getAliases();
    const bashFuncs = [];

    for (const [alias, source] of Object.entries(aliases)) {
      try {
        const snippetPath = path.join(config.path.base, source.snippet);
        const snippet = fs.readFileSync(snippetPath).toString();
        bashFuncs.push(this.transform(alias, snippet));
      } catch (e) {
        continue;
      }
    }
    fs.writeFileSync(config.path.aliases.bash, bashFuncs.join("\n\n"));
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
