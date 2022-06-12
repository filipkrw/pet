const mergeDeep = require("./mergeDeep");

function mockConfig(initState) {
  let config = initState;
  return {
    config,
    updateConfig: (parameters) => (config = mergeDeep(config, parameters)),
  };
}

module.exports = mockConfig;
