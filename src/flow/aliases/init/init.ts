import { exec } from "../../exec.js";
import { getUserShellData } from "./getUserShellData.js";
import { mountAliases } from "./mountAliases.js";

export async function initAliases() {
  return Promise.resolve(getUserShellData()) //
    .then((x) => exec(x, mountAliases));
}
