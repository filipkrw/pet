import prettyFormat from "./prettyFormat.js";

function createExportDefaultStr(val: Record<string, unknown>) {
  return `export default ${prettyFormat(val)};`;
}

export default createExportDefaultStr;
