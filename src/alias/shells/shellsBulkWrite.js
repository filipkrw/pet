const supportedShells = require("./supportedShells");

function shellsBulkWrite(targetShells) {
  for (const shell of targetShells) {
    if (!shell in supportedShells) {
      continue;
    }
    const Shell = supportedShells[shell];
    new Shell().write();
  }
}

module.exports = shellsBulkWrite;
