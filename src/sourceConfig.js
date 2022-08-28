const path = require("path");
const { config: globalConfig } = require("./config");
const flatten = require("tree-flatten");

function init() {
  const rootSourceConfig = { absolutePath: globalConfig.path.base };
  let config = resolveConfig(rootSourceConfig, initResolve);
  let configFlat = flatten(config, "sources");

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

  function requireConfig(sourceAbsolutePath) {
    const rootConfigPath = path.join(sourceAbsolutePath, ".pet", "config.js");
    try {
      return require(rootConfigPath);
    } catch (e) {
      // TODO log error when config exists, but cannot be loaded
      return {};
    }
  }

  function resolveAbsolutePath(sourceConfig, parentConfig) {
    return (
      sourceConfig.absolutePath ||
      path.resolve(
        parentConfig?.absolutePath || globalConfig.path.base,
        sourceConfig.relativePath || ""
      )
    );
  }

  function resolveName(sourceConfig) {
    return sourceConfig.name || path.basename(sourceConfig.absolutePath);
  }

  function initResolve(sourceConfig, parentConfig) {
    let c = {
      ...sourceConfig,
      absolutePath: resolveAbsolutePath(sourceConfig, parentConfig),
    };
    c = { ...c, name: resolveName(c) };
    c = { ...c, ...requireConfig(c.absolutePath) };
    return c;
  }

  function resolve(resolveFunc) {
    const resolvedConfig = resolveConfig(config, resolveFunc);
    setConfig(resolvedConfig);
  }

  return {
    resolve,
    getConfig: () => config,
    getConfigFlat: () => configFlat,
  };
}

module.exports = init();
