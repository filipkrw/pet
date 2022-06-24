const Fuse = require("fuse.js");
const flatten = require("tree-flatten");
const clc = require("cli-color");
const dree = require("dree");
const fs = require("fs");
const path = require("path");
const escapeRegex = require("./util/escapeRegex");
const commandLineArgs = require("command-line-args");

function getSources({ includeSources, config: argConfig }) {
  const sources = argConfig.userConfig.sources
    .filter((source) => {
      if (!includeSources) return true;
      const name =
        source.name ||
        path.basename(source.relativePath || source.absoluteName);
      return includeSources.includes(name);
    })
    .map((source) => ({
      ...source,
      absolutePath: path.resolve(argConfig.path.dotPet, source.relativePath),
      exclude: source.exclude || argConfig.defaultExclude,
    }));
  return { sources };
}

function constructOrRegex(strings) {
  const excludeStr = strings.map((s) => escapeRegex(s)).join("|");
  return new RegExp(excludeStr);
}

function getSourceFiles({ sources }) {
  const files = sources
    .map((source) =>
      dree.scan(source.absolutePath, {
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
  return { files };
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

function sortResults({ results }) {
  const resultsFlat = results
    .map(({ source, files }) => [...files.map((file) => ({ ...file, source }))])
    .flat();
  const resultsSorted = resultsFlat.sort((a, b) => b.score - a.score);
  return { results: resultsSorted };
}

function searchSourceFiles({ query, files }) {
  const results = files.map(({ source, nodes }) => ({
    source,
    nodes,
    files: search(query, nodes),
  }));
  return { results };
}

function printResults({ results, printOptions }) {
  for (const result of results) {
    const sourcePrefix = printOptions.hideSource ? "" : `${result.source}/`;
    console.log(clc.green.bold(`${sourcePrefix}${result.item.relativePath}`));
    if (!printOptions.namesOnly) {
      console.log(result.item.content.trimEnd());
      console.log();
    }
  }
  console.log(
    clc.blue.bold(`${results.length} result${results.length === 1 ? "" : "s"}`)
  );
}

function parseArgv({ argv }) {
  const options = commandLineArgs(
    [
      { name: "query", defaultOption: true, multiple: true },
      { name: "sources", alias: "s", multiple: true },
      { name: "hideSource", alias: "h", type: Boolean },
      { name: "namesOnly", alias: "n", type: Boolean },
    ],
    { argv }
  );
  const { sources, query, hideSource, namesOnly } = options;
  return {
    includeSources: sources,
    query: query.join(" "),
    printOptions: { hideSource, namesOnly },
  };
}

const flow = {
  modules: [
    parseArgv,
    getSources,
    getSourceFiles,
    searchSourceFiles,
    sortResults,
    printResults,
  ],
};

module.exports = { flow };
