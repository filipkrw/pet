import { spawn } from "child_process";
import { LocalConfig } from "../types";

export async function openEditor({
  file,
  localConfig,
}: {
  file: { absolutePath: string };
  localConfig: LocalConfig;
}): Promise<Record<string, never>> {
  const textEditor = localConfig.textEditor || "nano";
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
