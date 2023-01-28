import fs from "fs";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";
import { getTransformedAliasesPath } from "../../getTransformedAliasesPath.js";

export function mountZsh() {
  const zshrcPath = path.join(os.homedir(), ".zshrc");
  const zshrc = fs.readFileSync(zshrcPath);
  const mountSnippet = getZshrcMountSnippet();

  if (zshrc.indexOf(mountSnippet) === -1) {
    fs.writeFileSync(zshrcPath, mountSnippet, {
      flag: "a+",
    });
  }
}

function getZshrcMountSnippet() {
  const zshAliasesPath = getZshAliasesPath();
  const __dirname = fileURLToPath(new URL(".", import.meta.url));

  return fs
    .readFileSync(path.join(__dirname, ".zshrc_template"))
    .toString()
    .replace(/{{aliasesPath}}/g, zshAliasesPath);
}

function getZshAliasesPath() {
  return path.join(getTransformedAliasesPath(), "zsh_aliases");
}
