import Fuse from "fuse.js";
import clc from "cli-color";
import { getAllFiles } from "./handleAlias/helpers.js";
import parseArgvOptions from "./cmdArgs/parseArgvOptions.js";

async function handleFind(argv) {
  const { query } = parseQueryArgv(argv);
  const allFiles = await getAllFiles();
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

function searchFiles(query, sourceFiles) {
  if (!query) {
    return sourceFiles.map((f) => ({ item: f }));
  }
  return search(query, sourceFiles).sort((a, b) => b.score - a.score);
}

function search(query, files, keys = ["name", "relativePath", "content"]) {
  const fuse = new Fuse(files, {
    keys,
    includeScore: true,
    useExtendedSearch: true,
  });
  return fuse.search(query);
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

export default handleFind;
