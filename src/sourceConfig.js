import path from "path";
import config from "./config.js";
import flatten from "tree-flatten";
import { importConfigFile } from "./util/importConfig.mjs";
const { config: globalConfig } = config;

async function initSourceConfig() {
  const rootSourceConfig = { absolutePath: globalConfig.path.base };
  let config = await resolveConfig(rootSourceConfig, initResolver);
  let configFlat = flatten(config, "sources");

  async function reset() {
    config = await resolveConfig(rootSourceConfig, initResolver);
    configFlat = flatten(config, "sources");
  }

  async function initResolver(sourceConfig, parentConfig) {
    const absolutePath = resolveSourceAbsolutePath(sourceConfig, parentConfig);
    let c = {
      ...sourceConfig,
      absolutePath,
    };
    const loadedSourceConfig = await loadConfigFile(c.absolutePath);
    c = { ...loadedSourceConfig, ...c };
    if (parentConfig) {
      c = {
        ...c,
        name: resolveSourceName(c),
        rootRelativePath: path
          .relative(rootSourceConfig.absolutePath, absolutePath)
          .replace("\\", "/"),
      };
    } else {
      c = { name: "root", isRoot: true, ...c, rootRelativePath: "" };
    }
    return c;
  }

  function setConfig(newConfig) {
    config = newConfig;
    configFlat = flatten(newConfig, "sources");
  }

  async function resolveConfig(sourceConfig, resolveFunc, parentConfig) {
    const resolvedSource = await resolveFunc(sourceConfig, parentConfig);
    if (resolvedSource.sources) {
      const resolvedSubSources = await Promise.all(
        resolvedSource.sources.map((subSource) =>
          resolveConfig(subSource, resolveFunc, resolvedSource)
        )
      );
      return { ...resolvedSource, sources: resolvedSubSources };
    }
    return resolvedSource;
  }

  async function loadConfigFile(sourceAbsolutePath) {
    const rootConfigPath = path.join(sourceAbsolutePath, ".pet", "config.js");
    try {
      // Needed when resetting the config
      // delete require.cache[require.resolve(rootConfigPath)];
      const rootConfig = await importConfigFile(rootConfigPath);
      return { ...rootConfig, configAbsolutePath: rootConfigPath };
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

  async function resolve(resolveFunc) {
    const resolvedConfig = await resolveConfig(config, resolveFunc);
    setConfig(resolvedConfig);
  }

  return {
    resolve,
    resolveSource: async (source, resolveFunc) =>
      resolveConfig(source, resolveFunc),
    getConfig: () => config,
    getConfigFlat: () => configFlat,
    getSourceByName: (name) => configFlat.find((s) => s.name === name),
    reset,
  };
}

const sourceConfig = await initSourceConfig();
export default sourceConfig;
