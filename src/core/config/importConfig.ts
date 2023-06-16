import { pathToFileURL } from "url";

export async function importConfigFile(path: string): Promise<unknown> {
  const cacheBustingPath = `${pathToFileURL(
    path
  ).toString()}?update=${Date.now()}`;
  const { default: config } = await import(cacheBustingPath);
  return config;
}
