const fs = require("fs");
const path = require("path");
const os = require("os");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const clc = require("cli-color");
const handleInit = require("./init/handleInit");

function handleAlias(args, basePath) {
  const dotPetPath = path.join(basePath, ".pet");
  const dotPetAliasesPath = path.join(dotPetPath, ".pet_aliases");
  const dotPetBatchPath = path.join(dotPetPath, "batch_files");

  if (args.alias.length > 0 && args.alias[0] === "init") {
    handleInit(dotPetAliasesPath, dotPetPath);
    return;
  }

  if (args.alias.length < 2) {
    throw new Error("You must specify two arguments: alias and snippet");
  }

  const [alias, snippetPath] = args.alias;

  if (!fs.existsSync(dotPetBatchPath)) {
    fs.mkdirSync(dotPetBatchPath, { recursive: true });
  }

  const snippet = getSnippet(path.join(basePath, snippetPath));
  const aliasEntry = `alias ${alias}="${parseSnippetToCommand(
    snippet,
    "$"
  )}"\n`;
  fs.writeFileSync(dotPetAliasesPath, aliasEntry, { flag: "a+" }, (error) => {
    if (error) throw new Error(error);
  });

  const aliasBatFilePath = path.join(dotPetBatchPath, `${alias}.bat`);
  fs.writeFileSync(
    aliasBatFilePath,
    parseSnippetToCommand(snippet, "%"),
    { flag: "wx" },
    (error) => {
      if (error) throw new Error(error);
    }
  );
}

function parseSnippetToCommand(snippet, varSignifier) {
  let i = 0;
  // let command = snippet.replace(/(<[^>|^\*]*\*>)/g, `${varSignifier}*`); // doesn't work as I exptected on windows
  const command = snippet.replace(/(<[^>]*>)/g, () => {
    i++;
    return `${varSignifier}${i}`;
  });
  return command.trim();
}

function getSnippet(fullPath) {
  const snippet = fs.readFileSync(fullPath).toString().split("\n")[0];
  return snippet;
}

module.exports = handleAlias;
