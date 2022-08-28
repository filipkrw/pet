const { AliasesConfig } = require("../AliasesConfig");
const { getFileDetails } = require("../../config");
const path = require("path");
const fs = require("fs");
const CommandError = require("../CommandError");
const shellsBulkWrite = require("../shells/shellsBulkWrite");
const sourceConfig = require("../../sourceConfig");
const filesResolver = require("../../resolvers/filesResolver");
const flatten = require("tree-flatten/build/tree-flatten");

function handleAdd([alias, filePath]) {
  const targetFile = loadTargetFile(filePath);
  console.log(targetFile);

  // const { source, relativePath, absolutePath } = getFileDetails(snippetPath);
  // if (!fs.existsSync(absolutePath)) {
  //   throw new CommandError(`Snippet "${snippetPath}" doesn't exist.`);
  // }
  // const aliasesConfigPath = path.join(
  //   source.absolutePath,
  //   ".pet",
  //   "aliases.js"
  // );
  // const aliasesConfig = new AliasesConfig(aliasesConfigPath);
  // aliasesConfig.addAlias(alias, relativePath);
  // shellsBulkWrite(aliasesConfig);
  // console.log(`Alias "${alias}" added.`);
}

function loadTargetFile(filePath) {
  const [sourceName, ...rest] = filePath.split("/");
  const fileRelativePath = rest.join("/");
  const source = sourceConfig.getSourceByName(sourceName);
  if (!source) {
    throw new CommandError(`Source "${sourceName}" not found`);
  }
  const sourceWithFiles = sourceConfig.resolveSource(source, filesResolver);
  const files = flatten(sourceWithFiles, "sources").flatMap((s) => s.files);
  const targetFile = files.find((f) => f.relativePath === fileRelativePath);
  if (!targetFile) {
    throw new CommandError(
      `File "${fileRelativePath}" in source "${sourceName}" not found`
    );
  }
  return targetFile;
}

module.exports = handleAdd;
