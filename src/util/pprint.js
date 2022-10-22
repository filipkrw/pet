import json5 from "json5";
function pprint(val) {
    return json5.stringify(val, { space: 2, quote: '"' });
}
export default pprint;
