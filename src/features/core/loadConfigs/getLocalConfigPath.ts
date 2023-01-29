import path from "path";
import { getRootPath } from "../../../util/getRootPath.js";

export function getLocalConfigPath() {
  return path.join(getRootPath(), "localConfig");
}
