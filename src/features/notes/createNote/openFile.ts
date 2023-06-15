import path from "path";
import { LocalConfig, Vault } from "../../../core/types.js";
import { createDirectoryIfNotExists } from "../../../utils/files.js";
import { openEditor } from "./openEditor.js";
import { CreateArgs } from "./parseCreateArgv.js";
import { PetError } from "../../../core/PetError.js";
import { findParentVault } from "../../../core/vault/findParentVault.js";

export async function openFile({
  args,
  vaults,
  localConfig,
  disabledVaults,
}: {
  args: CreateArgs;
  localConfig: LocalConfig;
  vaults: Vault[];
  disabledVaults: Vault[];
}) {
  const absolutePath = path.resolve(localConfig.basePath, args.relativePath);

  const disabledParentVault = findParentVault(absolutePath, disabledVaults);
  if (disabledParentVault) {
    throw new PetError(
      `Vault is disabled: ${disabledParentVault.absolutePath}`
    );
  }

  const parentVault = findParentVault(absolutePath, vaults);
  if (!parentVault) {
    // This is to make TypeScript happy. This should never happen.
    throw new Error(`Vault not found for path: ${absolutePath}`);
  }

  createDirectoryIfNotExists(path.dirname(absolutePath));
  await openEditor({ file: { absolutePath }, vault: parentVault });
  return {
    file: { relativePath: args.relativePath, absolutePath },
  };
}
