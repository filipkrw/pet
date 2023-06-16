import path from "path";
import { getTestVaultPath } from "./getTestVaultPath";
import { getRootPath } from "../../utils/getRootPath";
import fse from "fs-extra";
import { nanoid } from "nanoid";

export async function cloneTestVault(name: string) {
  const vaultPath = getTestVaultPath(name);
  const clonePath = path.join(getRootPath(), ".tmp", nanoid(), name);

  await fse.copy(vaultPath, clonePath);

  return {
    vaultPath: clonePath,
    removeTestVault: () => fse.remove(clonePath),
  };
}
