import path from "path";
import { getTestVaultPath } from "./getTestVaultPath";
import { getRootPath } from "../../utils/getRootPath";
import fse from "fs-extra";

export function cloneTestVault(name: string) {
  const vaultPath = getTestVaultPath(name);
  const clonePath = path.join(getRootPath(), ".tmp", "test-vaults", name);
  fse.copySync(vaultPath, clonePath);
  return {
    vaultPath: clonePath,
    removeVault: () => fse.removeSync(clonePath),
  };
}
