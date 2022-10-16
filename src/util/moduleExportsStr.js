const pprint = require("./pprint");

function moduleExportsStr(val) {
  return `module.exports = ${pprint(val)};`;
}

module.exports = moduleExportsStr;
