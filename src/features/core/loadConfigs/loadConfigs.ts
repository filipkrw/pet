import { exec } from "../exec.js";
import { readLocalConfig } from "./readLocalConfig.js";
import { readVaultConfig } from "./readVaultConfig.js";

export function loadConfigs() {
  return readLocalConfig() //
    .then((x) => exec(x, readVaultConfig));
}
