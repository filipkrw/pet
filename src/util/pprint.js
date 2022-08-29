const json5 = require("json5");

function pprint(val) {
  return json5.stringify(val, { space: 2, quote: '"' });
}

module.exports = pprint;
