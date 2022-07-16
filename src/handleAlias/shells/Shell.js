const path = require("path");
const fs = require("fs");
const { config, updateConfig } = require("../../config.js");
const { createFileIfNotExists } = require("../../util/files.js");

class Shell {
  constructor(name, file, aliasesConfig) {
    this.name = name;
    this.aliasesConfig = aliasesConfig;
    updateConfig({
      path: {
        aliases: {
          [name]: path.join(config.path.dotPet, "aliases", "transformed", file),
        },
      },
    });
  }

  async init() {
    await this.mount();
    this.write();
    this.aliasesConfig.addShell(this.name);
  }

  write() {
    const aliases = this.aliasesConfig.getAliases();
    const transformed = [];

    for (const [alias, source] of Object.entries(aliases)) {
      try {
        const snippetPath = path.join(config.path.base, source.relativePath);
        const snippet = fs.readFileSync(snippetPath).toString();
        transformed.push(this.transform(alias, snippet));
      } catch (e) {
        console.log(`Error reading "${source.relativePath}", skipping...`);
        continue;
      }
    }

    const transformedPath = path.join(
      config.localConfig.path,
      "transformedAliases",
      this.name
    );
    createFileIfNotExists(transformedPath);
    fs.writeFileSync(transformedPath, transformed.join("\n\n"));
  }
}

module.exports = Shell;
