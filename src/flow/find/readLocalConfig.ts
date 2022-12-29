import * as path from "node:path";
import { z } from "zod";
import { getRootPath } from "../../util/getRootPath.js";
import { importConfigFile } from "../../util/importConfig.js";
import { localConfigSchema } from "../schemas/localConfigSchema.js";
import { LocalConfig } from "../types.js";

export async function readLocalConfig() {
  return {
    localConfig: await importLocalConfig(),
  };
}

async function importLocalConfig(): Promise<LocalConfig> {
  const petConfig = await importConfigFile(
    path.join(getRootPath(), "localConfig/petConfig.js")
  );
  return localConfigSchema.parse(petConfig);
}
