import { loadNote } from "../../../notes/util/loadNote.js";
import { Alias } from "../../schemas/aliasSchema.js";
import { VaultWithAliases } from "./loadAliasesConfig.js";

export type LoadedAlias = Alias & { content: string };

export function loadAliasesContent({ vaults }: { vaults: VaultWithAliases[] }) {
  const loadedAliases: LoadedAlias[] = [];

  for (const vault of vaults) {
    if (!vault.aliases) {
      continue;
    }

    for (const alias of vault.aliases) {
      if (alias.source.type === "inline") {
        loadedAliases.push({
          ...alias,
          content: alias.source.content,
        });
        continue;
      }

      try {
        const { relativePath } = alias.source;
        const content = loadNote({ vault, relativePath });
        loadedAliases.push({
          ...alias,
          content,
        });
      } catch (e) {
        console.log(
          `Error loading note "${alias.source.relativePath}" for alias "${alias.alias}", skipping...`
        );
        continue;
      }
    }
  }

  console.log(loadedAliases);

  return { loadedAliases };
}
