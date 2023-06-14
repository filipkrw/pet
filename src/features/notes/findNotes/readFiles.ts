import fg from "fast-glob";
import fs from "fs";
import path from "path";

import { Vault, VaultWithSubVaults } from "../../../core/types.js";
import { getBaseVault } from "../../../core/vault/getBaseVault.js";

export type FileWithVault = {
  name: string;
  relativePath: string;
  absolutePath: string;
  content: string;
  vault: Vault;
};

export async function readFiles({ vaults }: { vaults: Vault[] }): Promise<{
  vaults: Vault<{
    includePatterns: string[];
    excludePatterns: string[];
    files: FileWithVault[];
  }>[];
}> {
  const vaultsWithFiles: Vault<{
    includePatterns: string[];
    excludePatterns: string[];
    files: FileWithVault[];
  }>[] = [];

  for (const vault of vaults) {
    const excludePatterns = getVaultExcludePatterns(vault, vaults);
    const includePatterns = getVaultIncludePatterns(vault);
    const files = await readFilesContent(
      vault,
      includePatterns,
      excludePatterns
    );
    vaultsWithFiles.push({
      ...vault,
      includePatterns,
      excludePatterns,
      files,
    });
  }

  return { vaults: vaultsWithFiles };
}

function getVaultIncludePatterns(vault: VaultWithSubVaults) {
  return vault.config.includePatterns || ["**"];
}

function getVaultExcludePatterns(vault: VaultWithSubVaults) {
  return [
    ...(vault.config.excludePatterns || []),
    ...vault.subVaultsRelativePaths,
  ];
}

async function readFilesContent(
  vault: VaultWithSubVaults,
  includePatterns: string[],
  excludePatterns: string[]
) {
  const filePaths = fg.sync(includePatterns, {
    onlyFiles: true,
    cwd: vault.absolutePath,
    objectMode: true,
    ignore: excludePatterns,
  });
  const files = filePaths
    .map(({ name, path: relativePath }) => ({
      name,
      relativePath,
      absolutePath: path.join(vault.absolutePath, relativePath),
      vault: getBaseVault(vault),
    }))
    .map((snippet) => {
      try {
        const content = fs.readFileSync(snippet.absolutePath, "utf8");
        return { ...snippet, content };
      } catch (err) {
        console.error(err);
      }
    })
    .filter(Boolean);
  return files as FileWithVault[];
}
