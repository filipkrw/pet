const Fuse = require("fuse.js");
const flatten = require("tree-flatten");
const clc = require("cli-color");
const dree = require("dree");
const fs = require("fs");
const { config } = require("./config");

function setupFuse() {
  const tree = dree.scan(config.path.base, {
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

  return fuse;
}

function handleQuery(args) {
  const fuse = setupFuse();
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
    clc.blue.bold(
      `${result.length} snippet${result.length === 1 ? "" : "s"} found`
    )
  );
}

module.exports = handleQuery;
