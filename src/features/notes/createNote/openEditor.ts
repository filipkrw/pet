import { spawn } from "child_process";
import { NoteMetadata } from "./getNoteMetadata.js";

export async function openEditor({
  note,
}: {
  note: NoteMetadata & { datetime: string };
}): Promise<Record<string, never>> {
  const textEditor = note.parentVault.config.textEditor || "nano";
  const process = spawn(textEditor, [note.absolutePath], {
    shell: true,
    stdio: "inherit",
  });
  return new Promise((resolve, reject) => {
    process.on("close", () => resolve({}));
    process.on("exit", () => resolve({}));
    process.on("error", () => reject());
  });
}
