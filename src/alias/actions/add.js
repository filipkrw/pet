const { AliasesConfig } = require("../AliasesConfig");
const { config } = require("../../config");
const path = require("path");
const fs = require("fs");
const { writeAliasesPowershell } = require("../shells/powershell/powershell");
const CommandError = require("../../util/CommandError");

function handleAdd([alias, snippetPath]) {
  const aliasesConfig = new AliasesConfig(config.path.aliases.config);

  const snippetFullPath = path.join(config.path.base, snippetPath);
  if (!fs.existsSync(snippetFullPath)) {
    throw new CommandError(`Snippet "${snippetPath}" doesn't exist.`);
  }

  aliasesConfig.addAlias(alias, snippetPath);
  propagate(aliasesConfig);
  console.log(`Alias "${alias}" added.`);
}

function propagate(aliasesConfig) {
  const funcs = {
    powershell: writeAliasesPowershell,
  };
  for (const shell of aliasesConfig.getShells()) {
    const func = funcs[shell];
    if (!func) continue;
    func(aliasesConfig.getAliases());
  }
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
