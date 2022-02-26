const { AliasesConfig } = require("../AliasesConfig");
const { config } = require("../../config");
const path = require("path");
const fs = require("fs");
const CommandError = require("../../util/CommandError");
const shellsBulkWrite = require("../shells/shellsBulkWrite");

function handleAdd([alias, snippetPath]) {
  const snippetFullPath = path.join(config.path.base, snippetPath);
  if (!fs.existsSync(snippetFullPath)) {
    throw new CommandError(`Snippet "${snippetPath}" doesn't exist.`);
  }

  const aliasesConfig = new AliasesConfig(config.path.aliases.config);
  aliasesConfig.addAlias(alias, snippetPath);
  shellsBulkWrite(aliasesConfig.getShells());
  console.log(`Alias "${alias}" added.`);
}

module.exports = handleAdd;

// function handleAdd([alias, snippetPath]) {
//   if (!fs.existsSync(dotPetBatchPath)) {
//     fs.mkdirSync(dotPetBatchPath, { recursive: true });
//   }

//   const snippet = getSnippet(path.join(basePath, snippetPath));
//   const aliasEntry = `alias ${alias}="${parseSnippetToCommand(
//     snippet,
//     "$"
//   )}"\n`;
//   fs.writeFileSync(dotPetAliasesPath, aliasEntry, { flag: "a+" }, (error) => {
//     if (error) throw new Error(error);
//   });

//   const aliasBatFilePath = path.join(dotPetBatchPath, `${alias}.bat`);
//   fs.writeFileSync(
//     aliasBatFilePath,
//     parseSnippetToCommand(snippet, "%"),
//     { flag: "wx" },
//     (error) => {
//       if (error) throw new Error(error);
//     }
//   );
// }

// module.exports = handleAdd;
