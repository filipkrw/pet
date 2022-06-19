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

function fileExists(filePath) {
  return fs.existsSync(filePath);
}

module.exports = {
  createFileIfNotExists,
  createDirectoryIfNotExists,
  fileExists,
};
