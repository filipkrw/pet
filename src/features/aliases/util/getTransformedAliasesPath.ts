import path from "path";
import { getLocalConfigPath } from "../../../core/loadConfigs/getLocalConfigPath.js";

export function getTransformedAliasesPath() {
  return path.join(getLocalConfigPath(), "transformed_aliases");
}
