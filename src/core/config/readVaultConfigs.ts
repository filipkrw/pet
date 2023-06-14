import fg from "fast-glob";
import { z } from "zod";
import { FeatureMeta } from "../Feature";
import { LocalConfig } from "../types";
import { importConfigFile } from "./importConfig";

const vaultSchema = z.object({
  relativePath: z.string(),
  absolutePath: z.string(),
  subVaultsRelativePaths: z.array(z.string()),
  config: z.object({
    includePatterns: z.array(z.string()).optional(),
    excludePatterns: z.array(z.string()).optional(),
    features: z
      .object({
        enable: z.array(z.string()).optional(),
        disable: z.array(z.string()).optional(),
      })
      .optional(),
  }),
});

type Vault = z.infer<typeof vaultSchema>;

export async function readVaultConfigs({
  localConfig,
  feature,
}: {
  localConfig: LocalConfig;
  feature: FeatureMeta;
}): Promise<Vault[]> {
  const configFilePaths = await fg([
    `${localConfig.basePath}/**/.pet/config.mjs`,
  ]);
  const vaults: Vault[] = [];
  const ignoredVaults: Vault[] = [];

  for (const configFilePath of configFilePaths) {
    const config = await importConfigFile(configFilePath);

    const absolutePath = configFilePath.replace("/.pet/config.mjs", "");

    const relativePath = getVaultRelativePath(
      configFilePath,
      localConfig.basePath
    );

    const vault = vaultSchema.safeParse({
      relativePath,
      absolutePath,
      subVaultsRelativePaths: [],
      config,
    });

    if (!vault.success) {
      console.log(`Invalid config file: ${relativePath}`);
      continue;
    }

    if (
      ignoredVaults.find((iv) =>
        vault.data.absolutePath.startsWith(iv.absolutePath)
      )
    ) {
      continue;
    }

    if (!isFeatureAllowed(vault.data, feature)) {
      ignoredVaults.push(vault.data);
      continue;
    }

    vaults.push(vault.data);
  }

  for (const vault of vaults) {
    const subVaultsRelativePaths = vaults
      .filter(
        (v) =>
          vault.absolutePath !== v.absolutePath &&
          v.absolutePath.startsWith(vault.absolutePath)
      )
      .map((v) => v.relativePath)
      .sort();
    vault["subVaultsRelativePaths"] = subVaultsRelativePaths;
  }

  return vaults.sort((a, b) => a.absolutePath.localeCompare(b.absolutePath));
}

function isFeatureAllowed(vault: Vault, feature: FeatureMeta) {
  if (!vault.config.features) {
    return true;
  }

  if (vault.config.features.disable?.includes(feature.name)) {
    return false;
  }

  if (
    vault.config.features.disable?.includes("*") &&
    !vault.config.features.enable?.includes(feature.name)
  ) {
    return false;
  }

  return true;
}

function getVaultRelativePath(
  vaultConfigAbsolutePath: string,
  basePath: string
) {
  return vaultConfigAbsolutePath
    .replace(basePath, "")
    .replace("/.pet/config.mjs", "")
    .replace(/^\//, "");
}
