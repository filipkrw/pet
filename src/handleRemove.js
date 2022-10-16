const parseArgvOptions = require("./cmdArgs/parseArgvOptions");
const { getAllFiles } = require("./handleAlias/helpers");
const path = require("path");
const { fileExists } = require("./util/files");
const fs = require("fs");
const normalizePath = require("./util/normalizePath");

function handleRemove(argv) {
  const { snippetPath } = parseRemoveArgv(argv);
  const files = getAllFiles();
  const file = files.find((file) => {
    return getFileRootRelativePath(file) === path.normalize(snippetPath);
  });
  if (!file) {
    throw new Error(`No snippet found at "${snippetPath}".`);
  }
  const fileAbsolutePath = getFileAbsolutePath(file);
  if (fileExists(fileAbsolutePath)) {
    fs.rmSync(fileAbsolutePath);
    console.log(
      `Snippet "${normalizePath(getFileRootRelativePath(file))}" removed.`
    );
  }
}

function parseRemoveArgv(argv) {
  const options = parseArgvOptions(
    [{ name: "snippetPath", defaultOption: true }],
    argv
  );
  return options;
}

function getFileRootRelativePath(file) {
  return path.join(file.source.rootRelativePath, file.relativePath);
}

function getFileAbsolutePath(file) {
  return path.join(file.source.absolutePath, file.relativePath);
}

module.exports = handleRemove;
