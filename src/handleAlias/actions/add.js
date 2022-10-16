const { AliasesConfig } = require("../AliasesConfig");
const { getFileDetails } = require("../../config");
const path = require("path");
const fs = require("fs");
const CommandError = require("../CommandError");
const shellsBulkWrite = require("../shells/shellsBulkWrite");
const sourceConfig = require("../../sourceConfig");
const filesResolver = require("../../resolvers/filesResolver");
const flatten = require("tree-flatten/build/tree-flatten");
const { config: globalConfig } = require("../../config");
const moduleExportsStr = require("../../util/moduleExportsStr");
const pprint = require("../../util/pprint");
const { getAllAliases } = require("../helpers");
const { createFileIfNotExists, fileExists } = require("../../util/files");
const handleInit = require("./init");
const normalizePath = require("../../util/normalizePath");

function handleAdd([alias, filePath]) {
  const [source, targetFile] = loadTargetFile(filePath);
  addAlias(alias, targetFile, source);
  // shellsBulkWrite();

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
  return [source, targetFile];
}

function addAlias(alias, targetFile, aliasSource) {
  const rootSource = sourceConfig.getConfig();
  const rootSourceOriginal = getSourceConfigFile(rootSource);

  const aliases = rootSourceOriginal.aliases || [];
  validateAliasNotExists(alias);
  const updatedAliases = [
    ...aliases,
    {
      alias,
      relativePath: normalizePath(
        path.join(aliasSource.rootRelativePath, targetFile.relativePath)
      ),
    },
  ];
  fs.writeFileSync(
    rootSource.configAbsolutePath,
    moduleExportsStr({ ...rootSourceOriginal, aliases: updatedAliases })
  );
}

function validateAliasNotExists(alias) {
  const allAliases = getAllAliases();
  const existingAlias = allAliases.find((a) => a.alias === alias);
  if (existingAlias) {
    throw new CommandError(
      `Alias "${alias}" already exists in source "${existingAlias.source.name}".`
    );
  }
}

function getSourceConfigFile(source) {
  const configPath = source.configAbsolutePath;
  const config = fileExists(configPath) ? require(configPath) : {};
  return config;
}

module.exports = handleAdd;
