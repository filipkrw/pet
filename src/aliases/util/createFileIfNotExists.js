const fs = require("fs");

module.exports = function createFileIfNotExists(path) {
  if (!fs.existsSync(path)) {
    fs.openSync(path, "a");
  }
};
