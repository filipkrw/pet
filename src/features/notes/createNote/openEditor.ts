import { spawn } from "child_process";
import { VaultWithSubVaults } from "../../core/types.js";

export async function openEditor({
  file,
  vault,
}: {
  file: { absolutePath: string };
  vault: VaultWithSubVaults;
}): Promise<Record<string, never>> {
  const textEditor = vault.textEditor || "nano";
  const process = spawn(textEditor, [file.absolutePath], {
    shell: true,
    stdio: "inherit",
  });
  return new Promise((resolve, reject) => {
    process.on("close", () => resolve({}));
    process.on("exit", () => resolve({}));
    process.on("error", () => reject());
  });
}
