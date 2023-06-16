import { PetError } from "../../../../core/PetError.js";
import { LocalConfig, Vault } from "../../../../core/types.js";
import { fileExists } from "../../../../utils/files.js";
import { getNoteMetadata } from "../../../notes/createNote/getNoteMetadata.js";
import { VaultWithAliases } from "../../initAliases/steps/loadAliasesConfig.js";
import { Alias } from "../../schemas/aliasSchema.js";

export async function addAliasToConfig({
  newAlias,
  vaults,
  disabledVaults,
  localConfig,
}: {
  newAlias: Alias;
  vaults: VaultWithAliases[];
  disabledVaults: Vault[];
  localConfig: LocalConfig;
}): Promise<{
  updatedVault: VaultWithAliases;
}> {
  if (
    vaults
      .flatMap((vault) => vault.aliases || [])
      .find((x) => x.alias === newAlias.alias)
  ) {
    throw new PetError(`Alias "${newAlias.alias}" already exists`);
  }

  if (newAlias.source.type === "note") {
    const { note } = getNoteMetadata({
      args: { relativePath: newAlias.source.relativePath },
      vaults,
      disabledVaults,
      localConfig,
    });
    if (!fileExists(note.absolutePath)) {
      throw new PetError(
        `Note "${newAlias.source.relativePath}" does not exist`
      );
    }
    const newAliasRelativePath = newAlias.source.relativePath.replace(
      new RegExp(`^${note.parentVault.relativePath}/`),
      ""
    );
    return {
      updatedVault: {
        ...note.parentVault,
        aliases: [
          ...(note.parentVault.aliases || []),
          {
            ...newAlias,
            source: {
              ...newAlias.source,
              relativePath: newAliasRelativePath,
            },
          },
        ],
      },
    };
  }

  return {
    updatedVault: {
      ...vaults[0],
      aliases: [...(vaults[0].aliases || []), newAlias],
    },
  };
}
