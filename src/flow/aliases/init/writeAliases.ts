import { UserShellData } from "./getUserShellData.js";
import fs from "fs";
import { createFileIfNotExists } from "../../../util/files.js";

export function writeAliases({
  shell,
  transformedAliases,
}: {
  shell: UserShellData;
  transformedAliases: string;
}) {
  createFileIfNotExists(shell.transformedAliasesFilePath);
  fs.writeFileSync(shell.transformedAliasesFilePath, transformedAliases);
}
