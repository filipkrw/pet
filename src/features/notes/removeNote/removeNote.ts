import clc from "cli-color";
import fs from "fs/promises";
import path from "path";
import { ArgvOptions } from "../../../cli/types.js";
import { PetError } from "../../../core/PetError.js";
import { loadCoreConfigs } from "../../../core/config/loadCoreConfigs.js";
import { exec } from "../../../core/exec.js";
import { LocalConfig, VaultWithSubVaults } from "../../../core/types.js";
import { fileExists } from "../../../utils/files.js";
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
  vaults,
  localConfig,
}: {
  args: CreateArgs;
  vaults: VaultWithSubVaults[];
  localConfig: LocalConfig;
}) {
  const fileAbsoutePath = path.join(localConfig.basePath, args.relativePath);
  // TODO: handle ignored vault case
  if (!fileExists(fileAbsoutePath)) {
    throw new PetError(`Note "${args.relativePath}" doesn't exist`);
  }
  await fs.unlink(fileAbsoutePath);
}
