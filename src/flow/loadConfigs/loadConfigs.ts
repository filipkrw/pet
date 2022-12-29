import { exec } from "../exec.js";
import { readLocalConfig } from "../find/readLocalConfig.js";
import { readVaultConfig } from "../find/readVaultConfig.js";

export function loadConfigs() {
  return readLocalConfig() //
    .then((x) => exec(x, readVaultConfig));
}
