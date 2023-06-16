import * as path from "node:path";
import { z } from "zod";
import { getRootPath } from "../../utils/getRootPath.js";
import { importConfigFile } from "./importConfig.js";
import { LocalConfig } from "../types.js";

const localConfigSchema = z.object({ basePath: z.string() });

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
