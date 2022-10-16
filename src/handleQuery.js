const Fuse = require("fuse.js");
const clc = require("cli-color");
const { getAllFiles } = require("./handleAlias/helpers");

function handleQuery(args) {
  const query = args.query?.join(" ");
  const allFiles = getAllFiles();
  const results = searchFiles(query, allFiles);
  printResults(results, args);
}

function search(query, files, keys = ["name", "relativePath", "content"]) {
  const fuse = new Fuse(files, {
    keys,
    includeScore: true,
    // includeMatches: true,
    useExtendedSearch: true,
  });
  return fuse.search(query);
}

function searchFiles(query, sourceFiles) {
  if (!query) {
    return sourceFiles.map((f) => ({ item: f }));
  }
  return search(query, sourceFiles).sort((a, b) => b.score - a.score);
}

function printResults(results, args) {
  for (const result of results) {
    const sourcePrefix = getSourcePrefix(args, result.item.source);
    console.log(clc.green.bold(`${sourcePrefix}${result.item.relativePath}`));
    if (!args.namesOnly) {
      console.log(result.item.content.trimEnd());
      console.log();
    }
  }
  console.log(
    clc.blue.bold(`${results.length} result${results.length === 1 ? "" : "s"}`)
  );
}

function getSourcePrefix(args, source) {
  if (args.hideSource) {
    return "";
  }
  // if (source.isRoot) {
  //   return "root/";
  // }
  return `${source.name}/`;
}

module.exports = handleQuery;
