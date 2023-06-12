import clc from "cli-color";
import fs from "fs/promises";
import path from "path";
import { ArgvOptions } from "../../../cli/types.js";
import { CommandError } from "../../../core/CommandError.js";
import { loadCoreConfigs } from "../../../core/config/loadCoreConfigs.js";
import { exec } from "../../../core/exec.js";
import { VaultWithSubVaults } from "../../../core/types.js";
import { fileExists } from "../../../util/files.js";
import { notes } from "../Notes.js";
import { CreateArgs, parseCreateArgv } from "../createNote/parseCreateArgv.js";

export async function removeNote({ argv }: ArgvOptions) {
  return Promise.resolve({ ...notes.getMeta(), argv })
    .then((x) => exec(x, parseCreateArgv))
    .then((x) => exec(x, loadCoreConfigs))
    .then((x) => exec(x, deleteNoteFile))
    .then(() => console.log(clc.bold.green("Note has been removed")));
}

async function deleteNoteFile({
  args,
  vault,
}: {
  args: CreateArgs;
  vault: VaultWithSubVaults;
}) {
  const fileAbsoutePath = path.join(vault.absolutePath, args.relativePath);
  if (!fileExists(fileAbsoutePath)) {
    throw new CommandError(`Note "${args.relativePath}" doesn't exist`);
  }
  await fs.unlink(fileAbsoutePath);
}
