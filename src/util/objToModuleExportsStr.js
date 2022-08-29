const prettier = require("prettier");

function objToModuleExportsStr(obj) {
  const objJson = JSON.stringify(obj);
  const objModule = `module.exports = ${objJson}`;
  return prettier.format(objModule, { parser: "babel" });
}

module.exports = objToModuleExportsStr;
