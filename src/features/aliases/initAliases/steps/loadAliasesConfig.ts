import { z } from "zod";
import { importConfigFile } from "../../../../util/importConfig.js";
import { VaultWithSubVaults } from "../../../core/types.js";
import { aliasSchema } from "../../schemas/aliasSchema.js";
import { getAliasesConfigPath } from "../../util/getAliasesConfigPath.js";

const schema = z.object({
  aliases: z.array(aliasSchema),
});

export async function loadAliasesConfig({
  vault,
}: {
  vault: VaultWithSubVaults;
}) {
  try {
    const config = await importConfigFile(
      getAliasesConfigPath(vault.absolutePath)
    );
    return schema.parse(config);
  } catch (e) {
    return { aliases: [] };
  }
}
