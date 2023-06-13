import { pathToFileURL } from "url";

export async function importConfigFile(path: string) {
  const { default: config } = await import(pathToFileURL(path).toString());
  return config;
}
