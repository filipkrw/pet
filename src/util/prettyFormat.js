import json5 from "json5";

function prettyFormat(val) {
  return json5.stringify(val, { space: 2, quote: '"' });
}

export default prettyFormat;
