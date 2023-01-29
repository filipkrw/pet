import path from "path";
import { createDirectoryIfNotExists } from "../../../util/files.js";
import { VaultWithSubVaults } from "../../types";
import { openEditor } from "./openEditor.js";
import { CreateArgs } from "./parseCreateArgv.js";

export async function openFile({
  args,
  vault,
}: {
  args: CreateArgs;
  vault: VaultWithSubVaults;
}) {
  const absolutePath = path.resolve(vault.absolutePath, args.relativePath);
  createDirectoryIfNotExists(path.dirname(absolutePath));
  await openEditor({ file: { absolutePath }, vault });
  return {
    file: { relativePath: args.relativePath, absolutePath },
  };
}
