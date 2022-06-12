const frontMatter = require("front-matter");
const { config } = require("../config");
const { pipe } = require("./search");
const { produce } = require("immer");
const clc = require("cli-color");

const result = pipe(
  {
    bases: [
      {
        path: config.path.base,
        exclude: /\.pet|\.git|editors/,
      },
    ],
    query: "^git rename local",
    fuseOptions: {
      keys: ["name", "relativePath", "content"],
      // includeScore: true,
      // includeMatches: true,
      useExtendedSearch: true,
    },
  }
  // {
  //   beforeParseFiles,
  //   beforeSearch,
  // }
);

function beforeParseFiles(options) {
  const { bases } = options;
  return {
    ...options,
    bases: bases.map((base) => {
      return {
        ...base,
        docs: base.docs.map((d) => {
          return { ...d, frontMatter: frontMatter(d.content) };
        }),
      };
    }),
  };
}

function beforeSearch(input) {
  // return bases.map((base) => {
  //   return produce(base, (draft) => {
  //     draft.docs = draft.docs.filter((d) =>
  //       d?.frontMatter?.attributes?.tags?.includes("create")
  //     );
  //   });
  // });
  // console.log(input);
  return input;
}

result.reverse().forEach((snippet, index) => {
  console.log(clc.green.bold(snippet.item.relativePath));
  // if (!args.namesOnly) {
  console.log(snippet.item.content.trimEnd());
  console.log();
  // }
});

console.log(
  clc.blue.bold(
    `${result.length} snippet${result.length === 1 ? "" : "s"} found`
  )
);
