const aliasesResolver = require("../../resolvers/aliasesResolver");
const sourceConfig = require("../../sourceConfig");
const { getShells } = require("../helpers");
const supportedShells = require("./supportedShells");

function shellsBulkWrite() {
  // Make sure config is up to date; needed for `add` and `remove` commands
  sourceConfig.reset();
  sourceConfig.resolve(aliasesResolver);

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
