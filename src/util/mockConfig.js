import mergeDeep from "./mergeDeep";

function mockConfig(initState) {
  let config = initState;
  return {
    config,
    updateConfig: (parameters) => (config = mergeDeep(config, parameters)),
  };
}

export default mockConfig;
