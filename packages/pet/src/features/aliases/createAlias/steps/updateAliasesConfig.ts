import fs from "fs/promises";
import createExportDefaultStr from "../../../../utils/createExportDefaultStr.js";
import { VaultWithAliases } from "../../initAliases/steps/loadAliasesConfig.js";
import { getAliasesConfigPath } from "../../util/getAliasesConfigPath.js";

export async function saveAliasesConfig({
  updatedVault,
}: {
  updatedVault: VaultWithAliases;
}) {
  const aliasesConfigPath = getAliasesConfigPath(updatedVault.absolutePath);
  const aliasesConfigStr = createExportDefaultStr({
    aliases: updatedVault.aliases || [],
  });
  await fs.writeFile(aliasesConfigPath, aliasesConfigStr);
}
