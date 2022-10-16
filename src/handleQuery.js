const Fuse = require("fuse.js");
const clc = require("cli-color");
const { getAllFiles } = require("./handleAlias/helpers");
const parseArgvOptions = require("./cmdArgs/parseArgvOptions");

function handleQuery(argv) {
  const { query } = parseQueryArgv(argv);
  console.log(query);
  const allFiles = getAllFiles();
  const results = searchFiles(query, allFiles);
  printResults(results);
}

function parseQueryArgv(argv) {
  const options = parseArgvOptions(
    [{ name: "query", defaultOption: true, multiple: true }],
    argv
  );
  const { query } = options;
  return {
    query: query?.join(" "),
  };
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

function printResults(results) {
  for (const result of results) {
    const sourcePrefix = getSourcePrefix(result.item.source);
    console.log(clc.green.bold(`${sourcePrefix}${result.item.relativePath}`));
    console.log(result.item.content.trimEnd());
    console.log();
  }
  console.log(
    clc.blue.bold(`${results.length} result${results.length === 1 ? "" : "s"}`)
  );
}

function getSourcePrefix(source) {
  if (source.isRoot) {
    return "";
  }
  return `${source.rootRelativePath}/`;
}

module.exports = handleQuery;
