import { loadNote } from "../../../notes/util/loadNote.js";
import { VaultWithSubVaults } from "../../../../core/types.js";
import { Alias } from "../../schemas/aliasSchema.js";

export type LoadedAlias = Alias & { content: string };

export function loadAliasesContent({
  vault,
  aliases,
}: {
  vault: VaultWithSubVaults;
  aliases: Alias[];
}) {
  if (!aliases.length) {
    return { loadedAliases: [] };
  }

  const loadedAliases: LoadedAlias[] = [];

  for (const alias of aliases) {
    try {
      const { relativePath } = alias;
      const content = loadNote({ vault, relativePath });
      loadedAliases.push({
        ...alias,
        content,
      });
    } catch (e) {
      console.log(
        `Error loading note "${alias.relativePath}" for alias "${alias.alias}", skipping...`
      );
      continue;
    }
  }

  return { loadedAliases };
}
