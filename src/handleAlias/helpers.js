import config from "../config.js";
import filesResolver from "../resolvers/filesResolver.js";
import sourceConfig from "../sourceConfig.js";
import path from "path";

export function getAllAliases() {
  return sourceConfig
    .getConfigFlat()
    .filter((s) => s.aliases)
    .flatMap((s) =>
      s.aliases.map((a) => ({
        source: getSourceConfigToEmbed(s),
        ...a,
      }))
    );
}

export async function getAllFiles() {
  await sourceConfig.resolve(filesResolver);
  return sourceConfig.getConfigFlat().flatMap((s) =>
    s.files.map((f) => ({
      source: getSourceConfigToEmbed(s),
      ...f,
    }))
  );
}

export function getShells() {
  return config.config.localConfig.shells.shells;
}

function getSourceConfigToEmbed(s) {
  return {
    name: s.name,
    isRoot: s.isRoot,
    relativePath: s.relativePath,
    rootRelativePath: s.rootRelativePath,
    absolutePath: s.absolutePath,
    configAbsolutePath: s.configAbsolutePath,
  };
}

export function getFileRootRelativePath(file) {
  return path.join(file.source.rootRelativePath, file.relativePath);
}

export function getFileAbsolutePath(file) {
  return path.join(file.source.absolutePath, file.relativePath);
}
