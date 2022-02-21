#!/usr/bin/env node
const fs = require("fs");
const dree = require("dree");
const commandLineArgs = require("command-line-args");
const config = require("./config.js");
const clc = require("cli-color");
const flatten = require("tree-flatten");
const Fuse = require("fuse.js");

const tree = dree.scan(config.path, {
  normalize: true,
  exclude: /\.git|editors/,
});

const snippets = flatten(tree, "children")
  .filter((node) => node.type === "file")
  .map(({ name, path, relativePath }) => ({ name, path, relativePath }))
  .map((snippet) => {
    try {
      const content = fs.readFileSync(snippet.path, "utf8");
      return { ...snippet, content };
    } catch (err) {
      console.error(err);
    }
  });

const fuse = new Fuse(snippets, {
  keys: ["name", "relativePath", "content"],
  // includeScore: true,
  // includeMatches: true,
  useExtendedSearch: true,
});

const args = commandLineArgs([
  { name: "query", type: String, defaultOption: true, multiple: true },
  { name: "namesOnly", alias: "n", type: Boolean },
]);

if (args.query) {
  const query = args.query.join(" ");
  const result = fuse.search(query);

  result.reverse().forEach((snippet, index) => {
    console.log(clc.green.bold(snippet.item.relativePath));
    if (!args.namesOnly) {
      console.log(snippet.item.content.trimEnd());
      console.log();
    }
  });

  console.log(
    clc.blue.bold(`${result.length} snippet${result.length > 1 ? "s" : ""}`)
  );
}
