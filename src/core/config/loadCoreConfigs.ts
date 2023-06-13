import { FeatureMeta } from "../Feature.js";
import { exec } from "../exec.js";
import { readLocalConfig } from "./readLocalConfig.js";
import { readVaultConfigs } from "./readVaultConfigs.js";

export function loadCoreConfigs({ feature }: { feature: FeatureMeta }) {
  return Promise.resolve({ feature })
    .then((x) => exec(x, readLocalConfig))
    .then((x) => exec(x, readVaultConfigs));
}
