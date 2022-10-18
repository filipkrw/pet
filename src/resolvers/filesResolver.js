const fs = require("fs");
const path = require("path");
const fg = require("fast-glob");

function filesResolver(source) {
  const include = getSourceIncludePatterns(source);
  const exclude = getSourceExcludePatterns(source);
  const files = getSourceFilesWithContent(source, include, exclude);
  return { ...source, exclude, files };
}

function getSourceFilesWithContent(source, include, exclude) {
  const filePaths = fg.sync(include, {
    onlyFiles: true,
    cwd: source.absolutePath,
    objectMode: true,
    ignore: exclude,
  });
  const files = filePaths
    .map(({ name, path: relativePath }) => ({
      name,
      relativePath,
      absolutePath: path.join(source.absolutePath, relativePath),
    }))
    .map((snippet) => {
      try {
        const content = fs.readFileSync(snippet.absolutePath, "utf8");
        return { ...snippet, content };
      } catch (err) {
        console.error(err);
      }
    });
  return files;
}

function getSourceIncludePatterns(source) {
  return source.include || ["**"];
}

function getSourceExcludePatterns(source) {
  if (source.exclude) {
    return source.exclude;
  }
  return (source.sources || []).map((s) => s.relativePath);
}

module.exports = filesResolver;
