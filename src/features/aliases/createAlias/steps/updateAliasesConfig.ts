import createExportDefaultStr from "../../../../utils/createExportDefaultStr.js";
import { VaultWithSubVaults } from "../../../../core/types.js";
import { Alias } from "../../schemas/aliasSchema.js";
import { getAliasesConfigPath } from "../../util/getAliasesConfigPath.js";
import fs from "fs/promises";

export async function saveAliasesConfig({
  vault,
  aliases,
}: {
  vault: VaultWithSubVaults;
  aliases: Alias[];
}) {
  const aliasesConfigPath = getAliasesConfigPath(vault.absolutePath);
  const aliasesConfigStr = createExportDefaultStr({ aliases });
  await fs.writeFile(aliasesConfigPath, aliasesConfigStr);
}
