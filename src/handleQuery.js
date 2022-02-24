const clc = require("cli-color");

function handleQuery(args, fuse) {
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
