import { LoadedAlias } from "../loadAliases";

export function transformAliasesZsh({
  loadedAliases,
}: {
  loadedAliases: LoadedAlias[];
}) {
  const transformedAliases = loadedAliases.map(transform);
  return transformedAliases.join("\n\n");
}

function transform(alias: LoadedAlias) {
  const params: string[] = [];
  let funcBody = alias.content.replace(/(<[^>|^*]*>)/g, (match) => {
    const param = match.substr(1, match.length - 2).replace("-", "_");
    const indexInParams = params.findIndex((p) => p === param);
    if (indexInParams > -1) {
      return `$${indexInParams + 1}`;
    }
    params.push(param);
    return `$${params.length}`;
  });
  funcBody = funcBody
    .replace(/(<[^>]*\*>)/g, `$\{@:${params.length + 1}}`)
    .replace(/\n/g, "\n\t")
    .trim();

  const transformedAlias = `${alias.alias}() {\n\t${funcBody}\n}`;
  return transformedAlias.trim();
}
