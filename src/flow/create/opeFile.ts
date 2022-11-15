import { spawn } from "child_process";
import path from "path";
import { createDirectoryIfNotExists } from "../../util/files.js";
import { VaultWithSubVaults } from "../../vault/types";
import { LocalConfig } from "../types.js";
import { CreateArgs } from "./parseCreateArgv.js";

export async function openFile({
  args,
  vault,
  localConfig,
}: {
  args: CreateArgs;
  vault: VaultWithSubVaults;
  localConfig: LocalConfig;
}) {
  const absolutePath = path.resolve(vault.absolutePath, args.relativePath);
  createDirectoryIfNotExists(path.dirname(absolutePath));
  await openEditor(absolutePath, localConfig.textEditor);
  return {
    file: { relativePath: args.relativePath, absolutePath },
  };
}

async function openEditor(filePath: string, textEditor = "nano") {
  const process = spawn(textEditor, [filePath], {
    shell: true,
    stdio: "inherit",
  });
  return new Promise((resolve, reject) => {
    process.on("close", () => resolve(0));
    process.on("exit", () => resolve(0));
    process.on("error", () => reject());
  });
}
