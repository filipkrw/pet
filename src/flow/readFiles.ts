import { Vault, VaultWithSubVaults } from "../vault/types";
import fg from "fast-glob";
import fs from "fs";
import path from "path";
import { getBaseVault } from "../vault/getBaseVault.js";

export type FileWithVault = {
  name: string;
  relativePath: string;
  absolutePath: string;
  content: string;
  vault: Vault<>;
};

export async function readFiles<T>(x: Vault<T>): Promise<
  Vault<T> & {
    includePatterns: string[];
    excludePatterns: string[];
    files: FileWithVault[];
  }
> {
  const excludePatterns = getVaultExcludePatterns(x);
  const includePatterns = getVaultIncludePatterns(x);
  return {
    ...x,
    includePatterns,
    excludePatterns,
    files: await readFilesContent(x, includePatterns, excludePatterns),
  };
}

function getVaultIncludePatterns<T>(vault: VaultWithSubVaults<T>) {
  return ["**"];
  // source.include || ["**"];
}

function getVaultExcludePatterns<T>(vault: VaultWithSubVaults<T>) {
  // if (source.exclude) {
  //   return source.exclude;
  // }
  return (vault.vaults || []).map((s) => s.relativePath);
}

async function readFilesContent<T>(
  vault: VaultWithSubVaults<T>,
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
