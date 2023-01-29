import { exec } from "../exec.js";
import { readLocalConfig } from "./readLocalConfig.js";
import { readVaultConfig } from "./readVaultConfig.js";

export function loadCoreConfigs() {
  return readLocalConfig() //
    .then((x) => exec(x, readVaultConfig));
}
