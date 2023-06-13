import json5 from "json5";

function prettyFormat(val: Record<string, unknown>) {
  return json5.stringify(val, { space: 2, quote: '"' });
}

export default prettyFormat;
