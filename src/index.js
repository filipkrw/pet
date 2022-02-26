#!/usr/bin/env node
const fs = require("fs");
const dree = require("dree");
const commandLineArgs = require("command-line-args");
const config = require("../config.js");
const flatten = require("tree-flatten");
const Fuse = require("fuse.js");
const os = require("os");
const handleAlias = require("./aliases/handleAlias.js");
const handleQuery = require("./handleQuery.js");
const handleRun = require("./handleRun.js");

// const isWsl = os.release().indexOf("WSL") > -1;
// const basePath = isWsl ? winPathToWslPath(config.basePath) : config.basePath;

// function winPathToWslPath(winPath) {
//   return winPath.replace(/^([a-zA-z]):/, (_, diskLetter) => {
//     return `/mnt/${diskLetter.toLowerCase()}`;
//   });
// }

function parseBasePath(basePath) {
  if (typeof basePath === "string") {
    return basePath;
  }
  const platform = os.platform();
  if (platform in basePath) {
    return basePath[platform];
  }
  throw new Error(
    `No basePath specified for the operating system: ${platform}`
  );
}

const basePath = parseBasePath(config.basePath);

const tree = dree.scan(basePath, {
  normalize: true,
  exclude: /\.pet|\.git|editors/,
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
  { name: "alias", alias: "a", type: String, multiple: true },
  { name: "run", alias: "r", type: String, multiple: true },
]);

if (args.run) handleRun(args, basePath);
else if (args.alias) handleAlias(args, basePath);
else if (args.query) handleQuery(args, fuse);
