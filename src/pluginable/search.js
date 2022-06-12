const { config } = require("../config");
const Fuse = require("fuse.js");
const flatten = require("tree-flatten");
const clc = require("cli-color");
const dree = require("dree");
const fs = require("fs");
const isFunction = require("../util/isFunction");
const frontMatter = require("front-matter");

function readFiles(options) {
  const { bases } = options;
  return {
    ...options,
    bases: bases.map((base) => ({ ...base, docs: readBaseDocs(base) })),
  };
}

function readBaseDocs(base) {
  const fileTree = dree.scan(base.path, {
    normalize: true,
    exclude: base.exclude,
  });

  const docs = flatten(fileTree, "children")
    .filter((node) => node.type === "file")
    // .map(({ name, path, relativePath }) => ({ name, path, relativePath }))
    .map((doc) => {
      try {
        const content = fs.readFileSync(doc.path, "utf8");
        return { ...doc, content };
      } catch (err) {
        console.error(err);
      }
    });
  return docs;
}

function parseFiles(files) {
  return files;
}

function search(options) {
  const { bases, query, fuseOptions } = options;
  const docs = bases.reduce((acc, { docs }) => [...acc, ...docs], []);
  const fuse = new Fuse(docs, fuseOptions);
  return fuse.search(query);
}

function runHook(hook, input) {
  if (isFunction(hook)) {
    return hook(input);
  }
  return input;
}

function pipe(options, hooks = {}) {
  x = runHook(hooks.beforeReadFiles, options);
  x = readFiles(options);
  x = runHook(hooks.beforeParseFiles, x);
  x = parseFiles(x);
  x = runHook(hooks.beforeSearch, x);
  x = search(x);
  // x = runHook(hooks.beforeReturn, x);
  return x;
}

module.exports = { pipe };
