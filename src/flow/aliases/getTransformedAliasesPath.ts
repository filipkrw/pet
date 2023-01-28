import path from "path";
import { getLocalConfigPath } from "../loadConfigs/getLocalConfigPath.js";

export function getTransformedAliasesPath() {
  return path.join(getLocalConfigPath(), "transformed_aliases");
}
