const { getShells } = require("../helpers");
const supportedShells = require("./supportedShells");

function shellsBulkWrite() {
  const shells = getShells();
  for (const shell of shells) {
    if (!(shell in supportedShells)) {
      continue;
    }
    const Shell = supportedShells[shell];
    new Shell().write();
  }
}

module.exports = shellsBulkWrite;
