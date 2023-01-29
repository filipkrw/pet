import aliasesResolver from "../../resolvers/aliasesResolver.js";
import sourceConfig from "../../sourceConfig.js";
import { getShells } from "../helpers.js";
import supportedShells from "./supportedShells.js";

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

export default shellsBulkWrite;
