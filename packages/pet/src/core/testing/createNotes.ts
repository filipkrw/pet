import fs from "fs/promises";
import path from "path";

export function createNote(
  basePath: string,
  relativePath: string,
  content: string
) {
  return fs.writeFile(path.join(basePath, relativePath), content);
}
