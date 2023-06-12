import clc from "cli-color";
import { LoadedAlias } from "../../initAliases/steps/loadAliasesContent";
import { Alias } from "../../schemas/aliasSchema";

export function printAliases({
  loadedAliases,
}: {
  loadedAliases: LoadedAlias[];
}) {
  const sortedAliases = loadedAliases.sort((a, b) =>
    a.alias.localeCompare(b.alias)
  );
  for (const alias of sortedAliases) {
    console.log(getAliasTitle(alias));
    console.log(alias.content.trim());
    console.log();
  }

  const aliasesCount = sortedAliases.length;
  console.log(
    clc.blue.bold(
      `${aliasesCount} alias${aliasesCount === 1 ? "" : "es"} found`
    )
  );
}

function getAliasTitle(alias: Alias) {
  const title = `${clc.green.bold(alias.alias)} ${clc.green(
    `(${alias.relativePath})`
  )}`;
  if (alias.noVariableSubstitution) {
    return `${title} ${clc.blue("--no-subst")}`;
  }
  return title;
}
