import { exec } from "../../exec.js";
import { getUserPlatformData } from "./getUserPlatformData.js";
import { mount } from "./mount.js";

export async function initAliases() {
  return Promise.resolve(getUserPlatformData()) //
    .then((x) => exec(x, mount));
}
