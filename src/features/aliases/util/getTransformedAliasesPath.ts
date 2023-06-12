import path from "path";
import { getLocalConfigPath } from "../../../core/config/getLocalConfigPath.js";

export function getTransformedAliasesPath() {
  return path.join(getLocalConfigPath(), "transformed_aliases");
}
