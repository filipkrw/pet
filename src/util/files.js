const path = require("path");
const fs = require("fs");

function createFileIfNotExists(filePath) {
  if (!fileExists(filePath)) {
    const dirPath = path.dirname(filePath);
    createDirectoryIfNotExists(dirPath);
    fs.openSync(filePath, "a");
  }
}

function createDirectoryIfNotExists(dirPath) {
  if (!fileExists(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function deleteEmptyInFilePath(filePath) {
  if (isFileEmpty(filePath)) {
    fs.rmSync(filePath);
  }
  let dirPath = path.dirname(filePath);

  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (isDirEmpty(dirPath)) {
      fs.rmdirSync(dirPath);
      dirPath = path.dirname(dirPath);
    } else {
      break;
    }
  }
}

function fileExists(filePath) {
  return fs.existsSync(filePath);
}

function isFileEmpty(filePath) {
  const stat = fs.statSync(filePath);
  return stat.size === 0;
}

function isDirEmpty(dirPath) {
  const dirFiles = fs.readdirSync(dirPath);
  console.log(dirFiles);
  return dirFiles.length === 0;
}

module.exports = {
  createFileIfNotExists,
  createDirectoryIfNotExists,
  deleteEmptyInFilePath,
  fileExists,
  isFileEmpty,
  isDirEmpty,
};
