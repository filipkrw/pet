import { importConfigFile } from "../../../../util/importConfig.js";
import { VaultWithSubVaults } from "../../../core/types.js";
import { aliasesConfigSchema } from "../../schemas/aliasesConfigSchema.js";
import { getAliasesConfigPath } from "../../util/getAliasesConfigPath.js";

export async function loadAliasesConfig({
  vault,
}: {
  vault: VaultWithSubVaults;
}) {
  try {
    const config = await importConfigFile(
      getAliasesConfigPath(vault.absolutePath)
    );
    return aliasesConfigSchema.parse(config);
  } catch (e) {
    return { aliases: [] };
  }
}
