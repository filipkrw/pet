import { loadNote } from "../../../core/loadNote.js";
import { VaultWithSubVaults } from "../../../core/types.js";
import { Alias } from "../../schemas/aliasSchema.js";

export type LoadedAlias = Alias & { content: string };

export function loadAliases({ vault }: { vault: VaultWithSubVaults }) {
  if (!vault.aliases) {
    return { loadedAliases: [] };
  }

  const loadedAliases: LoadedAlias[] = [];

  for (const alias of vault.aliases) {
    try {
      const { relativePath } = alias;
      const content = loadNote({ vault, relativePath });
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
