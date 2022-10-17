const path = require("path");
const fs = require("fs");
const CommandError = require("../CommandError");
const shellsBulkWrite = require("../shells/shellsBulkWrite");
const sourceConfig = require("../../sourceConfig");
const moduleExportsStr = require("../../util/moduleExportsStr");
const {
  getAllAliases,
  getAllFiles,
  getFileRootRelativePath,
} = require("../helpers");
const normalizePath = require("../../util/normalizePath");
const getSourceRawConfigFile = require("../getSourceRawConfigFile");
const parseArgvOptions = require("../../cmdArgs/parseArgvOptions");

function handleAdd(argv) {
  const { alias, filePath } = parseAddArgv(argv);
  const targetFile = loadTargetFile(filePath);
  addAliasToRootSourceConfig(alias, targetFile, targetFile.source);
  shellsBulkWrite();
  console.log(`Alias "${alias}" added.`);
}

function parseAddArgv(argv) {
  const args = parseArgvOptions(
    [{ name: "query", type: String, defaultOption: true, multiple: true }],
    argv
  );
  if (args.query.length !== 2) {
    throw new CommandError(`Invalid arguments. Expected: "alias path/to/file"`);
  }
  return {
    alias: args.query[0],
    filePath: args.query[1],
  };
}

function loadTargetFile(filePath) {
  const files = getAllFiles();
  const targetFile = files.find(
    (f) => normalizePath(getFileRootRelativePath(f)) === filePath
  );
  if (!targetFile) {
    throw new CommandError(
      `File "${filePath}" in source "${targetFile.source.name}" not found`
    );
  }
  return targetFile;
}

function addAliasToRootSourceConfig(alias, targetFile, aliasSource) {
  const rootSource = sourceConfig.getConfig();
  const rootSourceRaw = getSourceRawConfigFile(rootSource);

  const aliases = rootSourceRaw.aliases || [];
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
    moduleExportsStr({ ...rootSourceRaw, aliases: updatedAliases })
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

module.exports = handleAdd;
