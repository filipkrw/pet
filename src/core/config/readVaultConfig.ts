import { z } from "zod";
import { LocalConfig } from "../types";
import { FeatureMeta } from "../Feature";

const vaultSchema = z.object({
  relativePath: z.string(),
  absolutePath: z.string(),
});

type Vault = z.infer<typeof vaultSchema>;

export async function readVaultConfig({
  localConfig,
  feature,
}: {
  localConfig: LocalConfig;
  feature: FeatureMeta;
}): Promise<Vault[]> {
  return [];
}
