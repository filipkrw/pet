import path from "path";
import fs from "fs";
import os from "os";
import config from "../../../config.js";
import { createFileIfNotExists } from "../../../util/files.js";
import Shell from "../Shell.js";

const { config: globalConfig } = config;

class Bash extends Shell {
  constructor() {
    super("bash", "bash_aliases");
  }
  async mount() {
    createFileIfNotExists(globalConfig.path.aliases[this.name]);
    try {
      const bashrcPath = path.join(os.homedir(), ".bashrc");
      createFileIfNotExists(bashrcPath);
      const bashrc = fs.readFileSync(bashrcPath);
      const toInject = fs
        .readFileSync(path.join(__dirname, ".bashrc_template"))
        .toString()
        .replace(/{{aliasesPath}}/g, globalConfig.path.aliases[this.name]);
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

export default Bash;
