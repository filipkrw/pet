const supportedShells = require("./supportedShells");

function shellsBulkWrite(aliasesConfig) {
  for (const shell of aliasesConfig.getShells()) {
    if (!(shell in supportedShells)) {
      continue;
    }
    const Shell = supportedShells[shell];
    new Shell(aliasesConfig).write();
  }
}

module.exports = shellsBulkWrite;
