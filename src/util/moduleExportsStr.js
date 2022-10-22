import pprint from "./pprint.js";
function moduleExportsStr(val) {
    return `module.exports = ${pprint(val)};`;
}
export default moduleExportsStr;
