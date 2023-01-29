import fs from "fs";
import path from "path";
import { VaultWithSubVaults } from "../../../core/types";
import { Alias } from "../../schemas/aliasSchema";

export type LoadedAlias = Alias & { content: string };

export function loadAliases({ vault }: { vault: VaultWithSubVaults }) {
  if (!vault.aliases) {
    return { loadedAliases: [] };
  }

  const loadedAliases: LoadedAlias[] = [];

  for (const alias of vault.aliases) {
    try {
      const { relativePath } = alias;
      const content = loadVaultFile({ vault, relativePath });
      loadedAliases.push({
        ...alias,
        content,
      });
    } catch (e) {
      console.log("Error loading alias", alias.alias);
      continue;
    }
  }

  return { loadedAliases };
}

function loadVaultFile({
  vault,
  relativePath,
}: {
  vault: VaultWithSubVaults;
  relativePath: string;
}) {
  const vaultFilePath = path.join(vault.absolutePath, relativePath);
  const vaultFile = fs.readFileSync(vaultFilePath, "utf8");
  return vaultFile;
}
