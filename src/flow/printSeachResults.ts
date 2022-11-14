import clc from "cli-color";
import { Vault } from "../vault/types";
import { FileWithVault } from "./readFiles";

export function printFindResults({
  searchResults,
}: {
  searchResults: FileWithVault[];
}) {
  for (const file of searchResults) {
    const sourcePrefix = getSourcePrefix(file.vault);
    console.log(clc.green.bold(`${sourcePrefix}${file.relativePath}`));
    console.log(file.content.trimEnd());
    console.log();
  }
  console.log(
    clc.blue.bold(
      `${searchResults.length} result${searchResults.length === 1 ? "" : "s"}`
    )
  );
}

function getSourcePrefix(vault: Vault<{}>) {
  if (!vault.relativePath) {
    return "";
  }
  return `[${vault.relativePath}]/`;
}
