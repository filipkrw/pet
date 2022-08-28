const path = require("path");
const { config: globalConfig } = require("./config");
const flatten = require("tree-flatten");

function initSourceConfig() {
  const rootSourceConfig = { absolutePath: globalConfig.path.base };
  let config = resolveConfig(rootSourceConfig, initResolver);
  let configFlat = flatten(config, "sources");

  function initResolver(sourceConfig, parentConfig) {
    let c = {
      ...sourceConfig,
      absolutePath: resolveSourceAbsolutePath(sourceConfig, parentConfig),
    };
    c = { ...c, name: resolveSourceName(c) };
    c = { ...c, ...loadConfigFile(c.absolutePath) };
    return c;
  }

  function setConfig(newConfig) {
    config = newConfig;
    configFlat = flatten(newConfig, "sources");
  }

  function resolveConfig(sourceConfig, resolveFunc, parentConfig) {
    const resolvedSource = resolveFunc(sourceConfig, parentConfig);
    if (resolvedSource.sources) {
      const resolvedSubSources = resolvedSource.sources.map((subSource) =>
        resolveConfig(subSource, resolveFunc, resolvedSource)
      );
      return { ...resolvedSource, sources: resolvedSubSources };
    }
    return resolvedSource;
  }

  function loadConfigFile(sourceAbsolutePath) {
    const rootConfigPath = path.join(sourceAbsolutePath, ".pet", "config.js");
    try {
      return require(rootConfigPath);
    } catch (e) {
      // TODO log error when config exists, but cannot be loaded
      return {};
    }
  }

  function resolveSourceAbsolutePath(sourceConfig, parentConfig) {
    return (
      sourceConfig.absolutePath ||
      path.resolve(
        parentConfig?.absolutePath || globalConfig.path.base,
        sourceConfig.relativePath || ""
      )
    );
  }

  function resolveSourceName(sourceConfig) {
    return sourceConfig.name || path.basename(sourceConfig.absolutePath);
  }

  function resolve(resolveFunc) {
    const resolvedConfig = resolveConfig(config, resolveFunc);
    setConfig(resolvedConfig);
  }

  return {
    resolve,
    resolveSource: (source, resolveFunc) => resolveConfig(source, resolveFunc),
    getConfig: () => config,
    getConfigFlat: () => configFlat,
    getSourceByName: (name) => configFlat.find((s) => s.name === name),
  };
}

module.exports = initSourceConfig();
