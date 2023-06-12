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
  const titleElems = [`${clc.green.bold(alias.alias)}`];
  if (alias.source.type === "note") {
    titleElems.push(clc.green(`(${alias.source.relativePath})`));
  } else {
    titleElems.push(clc.blue("--inline"));
  }
  if (alias.noVariableSubstitution) {
    titleElems.push(clc.blue("--no-subst"));
  }
  return titleElems.join(" ");
}
