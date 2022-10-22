import { pathToFileURL } from "url";

export async function importConfigFile(path) {
  const { default: config } = await import(pathToFileURL(path));
  return config;
}
