import prettyFormat from "./prettyFormat.js";

function createExportDefaultStr(val) {
  return `export default ${prettyFormat(val)};`;
}

export default createExportDefaultStr;
