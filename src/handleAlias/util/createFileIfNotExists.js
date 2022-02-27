const path = require("path");
const fs = require("fs");

function createFileIfNotExists(filePath) {
  if (!fs.existsSync(filePath)) {
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.openSync(filePath, "a");
  }
}

module.exports = createFileIfNotExists;
