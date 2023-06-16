import { z } from "zod";
import { importConfigFile } from "../../../../core/config/importConfig.js";
import { Vault, VaultWithSubVaults } from "../../../../core/types.js";
import { aliasesConfigSchema } from "../../schemas/aliasesConfigSchema.js";
import { getAliasesConfigPath } from "../../util/getAliasesConfigPath.js";

export type VaultWithAliases = Vault<
  Partial<z.infer<typeof aliasesConfigSchema>>
>;

export async function loadAliasesConfig({
  vaults,
}: {
  vaults: VaultWithSubVaults[];
}) {
  const vaultsWithAliases: VaultWithAliases[] = [];

  for (const vault of vaults) {
    const aliasesConfigPath = getAliasesConfigPath(vault.absolutePath);

    try {
      const aliasesConfig = await importConfigFile(aliasesConfigPath);

      const parsedAliasesConfig = aliasesConfigSchema.safeParse(aliasesConfig);

      if (!parsedAliasesConfig.success) {
        console.log(`Invalid aliases config file: ${aliasesConfigPath}`);
        vaultsWithAliases.push(vault);
        continue;
      }

      vaultsWithAliases.push({
        ...vault,
        ...parsedAliasesConfig.data,
      });
    } catch (e) {
      vaultsWithAliases.push(vault);
      continue;
    }
  }

  return { vaults: vaultsWithAliases };
}
