const path = require("path");
const { config: globalConfig } = require("./config");

function init() {
  const rootSourceConfig = { absolutePath: globalConfig.path.base };
  let config = resolveConfig(rootSourceConfig, initResolve);

  function resolveConfig(sourceConfig, resolveFunc) {
    const resolvedSource = resolveFunc(sourceConfig);
    if (resolvedSource.sources) {
      const resolvedSubSources = resolvedSource.sources.map((subSource) =>
        resolveConfig(subSource, resolveFunc)
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

  function initResolve(sourceConfig, parentConfig) {
    const absolutePath = resolveAbsolutePath(sourceConfig, parentConfig);
    const fullConfig = requireConfig(absolutePath);
    return {
      ...sourceConfig,
      ...fullConfig,
      absolutePath,
    };
  }

  return {
    config,
    resolve: (resolveFunc) => {
      config = resolveConfig(config, resolveFunc);
    },
  };
}

module.exports = init();
