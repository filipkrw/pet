const fs = require("fs");
const path = require("path");
const os = require("os");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const clc = require("cli-color");
const handleInit = require("./init/handleInit");
const { config, updateConfig } = require("../config.js");

function handleAlias(args) {
  updateConfig({
    path: {
      aliases: {
        base: path.join(config.path.dotPet, "aliases"),
        config: path.join(config.path.dotPet, "aliases", "config.json"),
      },
    },
  });

  if (args.alias.length > 0 && args.alias[0] === "init") {
    handleInit();
    return;
  }

  if (args.alias.length < 2) {
    throw new Error("You must specify two arguments: alias and snippet");
  }

  // const [alias, snippetPath] = args.alias;

  // if (!fs.existsSync(dotPetBatchPath)) {
  //   fs.mkdirSync(dotPetBatchPath, { recursive: true });
  // }

  // const snippet = getSnippet(path.join(basePath, snippetPath));
  // const aliasEntry = `alias ${alias}="${parseSnippetToCommand(
  //   snippet,
  //   "$"
  // )}"\n`;
  // fs.writeFileSync(dotPetAliasesPath, aliasEntry, { flag: "a+" }, (error) => {
  //   if (error) throw new Error(error);
  // });

  // const aliasBatFilePath = path.join(dotPetBatchPath, `${alias}.bat`);
  // fs.writeFileSync(
  //   aliasBatFilePath,
  //   parseSnippetToCommand(snippet, "%"),
  //   { flag: "wx" },
  //   (error) => {
  //     if (error) throw new Error(error);
  //   }
  // );
}

module.exports = handleAlias;
