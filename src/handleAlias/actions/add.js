const path = require("path");
const fs = require("fs");
const CommandError = require("../CommandError");
const shellsBulkWrite = require("../shells/shellsBulkWrite");
const sourceConfig = require("../../sourceConfig");
const filesResolver = require("../../resolvers/filesResolver");
const flatten = require("tree-flatten/build/tree-flatten");
const moduleExportsStr = require("../../util/moduleExportsStr");
const { getAllAliases } = require("../helpers");
const normalizePath = require("../../util/normalizePath");
const getSourceRawConfigFile = require("../getSourceRawConfigFile");
const parseArgvOptions = require("../../cmdArgs/parseArgvOptions");

function handleAdd(argv) {
  const { alias, filePath } = parseAddArgv(argv);
  const [source, targetFile] = loadTargetFile(filePath);
  addAliasToRootSourceConfig(alias, targetFile, source);
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
