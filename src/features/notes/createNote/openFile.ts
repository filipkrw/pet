import path from "path";
import { createDirectoryIfNotExists } from "../../../utils/files.js";
import { LocalConfig, VaultWithSubVaults } from "../../../core/types.js";
import { openEditor } from "./openEditor.js";
import { CreateArgs } from "./parseCreateArgv.js";

export async function openFile({
  args,
  vaults,
  localConfig,
}: {
  args: CreateArgs;
  vaults: VaultWithSubVaults[];
  localConfig: LocalConfig;
}) {
  const absolutePath = path.resolve(localConfig.basePath, args.relativePath);
  const closestVault = vaults
    .filter((x) => absolutePath.startsWith(x.absolutePath))
    .at(-1);

  if (!closestVault) {
    throw new Error(`Vault not found for path: ${absolutePath}`);
  }

  createDirectoryIfNotExists(path.dirname(absolutePath));
  await openEditor({ file: { absolutePath }, vault: closestVault });
  return {
    file: { relativePath: args.relativePath, absolutePath },
  };
}
