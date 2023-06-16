import Fuse from "fuse.js";
import { VaultWithSubVaults } from "../../../core/types.js";
import { FindArgs } from "./parseFindArgv.js";
import { FileWithVault } from "./readFiles.js";

type VaultWithFiles = VaultWithSubVaults<{ files: FileWithVault[] }>;

export function searchFiles({
  vaults,
  args,
}: {
  vaults: VaultWithFiles[];
  args: FindArgs;
}) {
  const files = getVaultFiles(vaults);
  const searchResults = search(args.query, files);
  return { searchResults };
}

function getVaultFiles(vaults: VaultWithFiles[]) {
  return vaults.flatMap((vault) => vault.files);
}

function search(query: string, files: FileWithVault[]) {
  if (!query) {
    return files;
  }
  return searchFuse(query, files)
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .map((x) => x.item) as FileWithVault[];
}

function searchFuse(
  query: string,
  files: FileWithVault[],
  keys = ["name", "relativePath", "content"]
) {
  const fuse = new Fuse(files, {
    keys,
    includeScore: true,
    useExtendedSearch: true,
  });
  return fuse.search(query);
}