import path from "path";
import { VaultWithSubVaults } from "../../types";
import { CreateArgs } from "./parseCreateArgv.js";

export async function getFilePath({
  args,
  vault,
}: {
  args: CreateArgs;
  vault: VaultWithSubVaults;
}) {
  const absolutePath = path.resolve(vault.absolutePath, args.relativePath);
  return { file: { absolutePath } };
}
