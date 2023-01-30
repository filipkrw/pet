import clc from "cli-color";
import { LoadedAlias } from "../../initAliases/steps/loadAliasesContent";

export function printAliases({
  loadedAliases,
}: {
  loadedAliases: LoadedAlias[];
}) {
  const sortedAliases = loadedAliases.sort((a, b) =>
    a.alias.localeCompare(b.alias)
  );
  for (const alias of sortedAliases) {
    console.log(
      `${clc.green.bold(alias.alias)} ${clc.green(`(${alias.relativePath})`)}`
    );

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
