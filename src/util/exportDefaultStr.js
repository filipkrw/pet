import pprint from "./pprint.js";

function exportDefaultStr(val) {
  return `export default ${pprint(val)};`;
}

export default exportDefaultStr;
