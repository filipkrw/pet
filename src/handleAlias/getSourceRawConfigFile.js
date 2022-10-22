import { fileExists } from "../util/files.js";
import { importConfigFile } from "../util/importConfig.mjs";

async function getSourceRawConfigFile(source) {
  const configPath = source.configAbsolutePath;
  if (!fileExists(configPath)) {
    throw new Error(`Config file does not exist: ${configPath}`);
  }
  return importConfigFile(configPath);
}
export default getSourceRawConfigFile;
