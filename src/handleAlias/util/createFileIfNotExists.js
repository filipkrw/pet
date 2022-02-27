const fs = require("fs");

function createFileIfNotExists(path) {
  if (!fs.existsSync(path)) {
    fs.openSync(path, "a");
  }
}

module.exports = createFileIfNotExists;
