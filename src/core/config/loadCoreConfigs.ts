import { FeatureMeta } from "../Feature.js";
import { exec } from "../exec.js";
import { readLocalConfig } from "./readLocalConfig.js";
import { readVaultConfig } from "./readVaultConfig.js";

export function loadCoreConfigs({ feature }: { feature: FeatureMeta }) {
  return Promise.resolve({ feature })
    .then((x) => exec(x, readLocalConfig))
    .then((x) => exec(x, readVaultConfig));
}
