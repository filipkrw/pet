const path = require("path");

/**
 * Correctness of this function is dependent on the "main"
 * path in package.json.
 */
function getRootPath() {
  const srcPath = path.dirname(require.main.filename);
  return path.normalize(path.join(srcPath, ".."));
}

module.exports = getRootPath;
