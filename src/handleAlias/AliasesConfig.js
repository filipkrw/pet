const fs = require("fs");
const CommandError = require("./CommandError");
const createFileIfNotExists = require("../util/createFileIfNotExists");
const removeDuplicates = require("../util/removeDuplicates");

class AliasesConfig {
  constructor(path) {
    this.path = path;
    this.readConfig();
  }

  getAliases() {
    return this.config.aliases || [];
  }

  getShells() {
    return this.config.shells || [];
  }

  addShell(shell) {
    const shells = this.config.shells || [];
    const newShells = [...shells, shell].filter(removeDuplicates);
    this.writeConfig({ ...this.config, shells: newShells });
  }

  addAlias(alias, snippet) {
    const aliases = this.config.aliases || {};
    const newAliases = { ...aliases, [alias]: { snippet } };
    this.writeConfig({ ...this.config, aliases: newAliases });
  }

  removeAlias(alias) {
    const aliases = this.config.aliases || {};
    if (alias in aliases) {
      delete aliases[alias];
      this.writeConfig({ ...this.config, aliases });
    } else {
      throw new CommandError(`Alias "${alias}" doesn't exist.`);
    }
  }

  readConfig() {
    createFileIfNotExists(this.path);
    const configJson = fs.readFileSync(this.path, { encoding: "utf8" }) || "{}";
    this.config = JSON.parse(configJson);
  }

  writeConfig(config) {
    fs.writeFileSync(this.path, JSON.stringify(config, null, 2), { flag: "w" });
    this.config = config;
  }
}

module.exports = { AliasesConfig };
