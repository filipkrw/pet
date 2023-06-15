import { pathToFileURL } from "url";

export async function importConfigFile(path: string): Promise<unknown> {
  const { default: config } = await import(pathToFileURL(path).toString());
  return config;
}
