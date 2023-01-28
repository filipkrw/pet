import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export function mountZsh({
  zshrcPath,
  zshAliasesPath,
}: {
  zshrcPath: string;
  zshAliasesPath: string;
}) {
  const zshrc = fs.readFileSync(zshrcPath);
  const mountSnippet = getZshrcMountSnippet(zshAliasesPath);

  if (zshrc.indexOf(mountSnippet) === -1) {
    fs.writeFileSync(zshrcPath, mountSnippet, {
      flag: "a+",
    });
  }
}

function getZshrcMountSnippet(zshAliasesPath: string) {
  const __dirname = fileURLToPath(new URL(".", import.meta.url));

  return fs
    .readFileSync(path.join(__dirname, ".zshrc_template"))
    .toString()
    .replace(/{{aliasesPath}}/g, zshAliasesPath);
}
