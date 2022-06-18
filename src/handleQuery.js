const Fuse = require("fuse.js");
const flatten = require("tree-flatten");
const clc = require("cli-color");
const dree = require("dree");
const fs = require("fs");
const { config } = require("./config");
const path = require("path");
const escapeRegex = require("./util/escapeRegex");

const defaultExclude = [".pet", ".git"];

function getSources() {
  const sources = [];
  for (const source of config.userConfig.sources) {
    const sourcePath = path.resolve(config.path.dotPet, source.root);
    if (source.exclude) {
      sources.push({ ...source, path: sourcePath });
    } else {
      sources.push({ ...source, path: sourcePath, exclude: defaultExclude });
    }
  }
  return sources;
}

function constructOrRegex(strings) {
  const excludeStr = strings.map((s) => escapeRegex(s)).join("|");
  return new RegExp(excludeStr);
}

function prepareSourceFiles() {
  return getSources()
    .map((source) =>
      dree.scan(source.path, {
        normalize: true,
        exclude: constructOrRegex(source.exclude),
      })
    )
    .map((node) => ({
      source: node.name,
      nodes: flatten(node, "children"),
    }))
    .map((source) => ({
      ...source,
      nodes: source.nodes
        .filter((node) => node.type === "file")
        .map(({ name, path, relativePath }) => ({ name, path, relativePath }))
        .map((snippet) => {
          try {
            const content = fs.readFileSync(snippet.path, "utf8");
            return { ...snippet, content };
          } catch (err) {
            console.error(err);
          }
        }),
    }));
}

function search(query, nodes, keys = ["name", "relativePath", "content"]) {
  const fuse = new Fuse(nodes, {
    keys,
    includeScore: true,
    // includeMatches: true,
    useExtendedSearch: true,
  });
  return fuse.search(query);
}

function sortResults(results) {
  const resultsFlat = results
    .map(({ source, files }) => [...files.map((file) => ({ ...file, source }))])
    .flat();
  const resultsSorted = resultsFlat.sort((a, b) => b.score - a.score);
  return resultsSorted;
}

function searchSourceFiles(query, sourceFiles) {
  const results = sourceFiles.map(({ source, nodes }) => ({
    source,
    nodes,
    files: search(query, nodes),
  }));
  return sortResults(results);
}

function printResults(results, args) {
  for (const result of results) {
    console.log(clc.green.bold(`${result.source}/${result.item.relativePath}`));
    if (!args.namesOnly) {
      console.log(result.item.content.trimEnd());
      console.log();
    }
  }
  console.log(
    clc.blue.bold(`${results.length} result${results.length === 1 ? "" : "s"}`)
  );
}

function handleQuery(args) {
  const sourceFiles = prepareSourceFiles();
  const query = args.query.join(" ");
  const results = searchSourceFiles(query, sourceFiles);
  printResults(results, args);
}

module.exports = handleQuery;
