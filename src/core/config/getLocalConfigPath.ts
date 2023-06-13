import path from "path";
import { getRootPath } from "../../utils/getRootPath.js";

export function getLocalConfigPath() {
  return path.join(getRootPath(), "localConfig");
}
