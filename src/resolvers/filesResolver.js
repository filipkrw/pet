const escapeRegex = require("../util/escapeRegex");
const dree = require("dree");
const flatten = require("tree-flatten");
const fs = require("fs");

function filesResolver(source) {
  const exclude = resolveSourceExclude(source);
  const files = resolveFiles(source, exclude);

  // resolve exclude
  // load files

  return { ...source, exclude, files };
}

function resolveFiles(source, exclude) {
  const nodeTree = dree.scan(source.absolutePath, {
    normalize: true,
    exclude: constructOrRegex(exclude),
  });
  const nodes = flatten(nodeTree, "children").filter(
    (node) => node.type === "file"
  );
  const files = nodes
    .map(({ name, path, relativePath }) => ({ name, path, relativePath }))
    .map((snippet) => {
      try {
        const content = fs.readFileSync(snippet.path, "utf8");
        return { ...snippet, content };
      } catch (err) {
        console.error(err);
      }
    });
  return files;
}

function resolveSourceExclude(source) {
  const exclude = source.exclude || [".pet", ".git"];
  // const subsourcesExclude = (source.sources| []).map((s) => s.relativePath);
  // should handle absolute paths too
  // TODO should probably exclude subsources too
  return exclude;
}

function constructOrRegex(strings) {
  const excludeStr = strings.map((s) => escapeRegex(s)).join("|");
  return new RegExp(excludeStr);
}

// function prepareSourceFiles(includeSources) {
//   return getSources(includeSources)
//     .map((source) =>
//       dree.scan(source.absolutePath, {
//         normalize: true,
//         exclude: constructOrRegex(source.exclude),
//       })
//     )
//     .map((node) => ({
//       source: node.name,
//       nodes: flatten(node, "children"),
//     }))
//     .map((source) => ({
//       ...source,
//       nodes: source.nodes
//         .filter((node) => node.type === "file")
//         .map(({ name, path, relativePath }) => ({ name, path, relativePath }))
//         .map((snippet) => {
//           try {
//             const content = fs.readFileSync(snippet.path, "utf8");
//             return { ...snippet, content };
//           } catch (err) {
//             console.error(err);
//           }
//         }),
//     }));
// }

module.exports = filesResolver;
