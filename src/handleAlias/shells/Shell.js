const path = require("path");
const fs = require("fs");
const { config, updateConfig } = require("../../config.js");
const { createFileIfNotExists } = require("../../util/files.js");
const removeDuplicates = require("../../util/removeDuplicates.js");
const { getAllAliases } = require("../helpers.js");

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
    // this.writeShellConfig();
  }

  write() {
    const aliases = getAllAliases();
    const transformed = [];

    for (const { alias, content, source } of aliases) {
      try {
        transformed.push(this.transform(alias, content));
      } catch (e) {
        console.log(`Error reading "${source.name}", skipping...`);
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

  writeShellConfig() {
    const shellConfigPath = config.localConfig.shells.path;
    createFileIfNotExists(shellConfigPath);
    const shellConfigJSON = fs.readFileSync(shellConfigPath, {
      encoding: "utf-8",
    });
    const shellConfig = JSON.parse(shellConfigJSON || "[]");
    const newShells = [...shellConfig, this.name].filter(removeDuplicates);
    fs.writeFileSync(shellConfigPath, JSON.stringify(newShells, null, 2));
  }
}

module.exports = Shell;
