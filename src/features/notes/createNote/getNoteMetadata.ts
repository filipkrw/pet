import path from "path";
import { LocalConfig, Vault } from "../../../core/types.js";
import { CreateArgs } from "./parseCreateArgv.js";
import { findParentVault } from "../../../core/vault/findParentVault.js";
import { PetError } from "../../../core/PetError.js";

export type NoteMetadata = {
  absolutePath: string;
  relativePath: string;
  parentVault: Vault;
};

export function getNoteMetadata({
  args,
  vaults,
  localConfig,
  disabledVaults,
}: {
  args: CreateArgs;
  localConfig: LocalConfig;
  vaults: Vault[];
  disabledVaults: Vault[];
}): { note: NoteMetadata } {
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

  return {
    note: {
      absolutePath,
      relativePath: args.relativePath,
      parentVault,
    },
  };
}
