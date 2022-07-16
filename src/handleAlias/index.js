const handleInit = require("./actions/init");
const handleRemove = require("./actions/remove");
const handleAdd = require("./actions/add");
const handleList = require("./actions/list");
const CommandError = require("./CommandError");

async function handleAlias(args) {
  if (args.remove) {
    if (args.query.length !== 1) {
      throw new Error("You must specify name of the snippet to remove.");
    }
    handleRemove(args.query[0]);
  } else if (args.list) {
    handleList(args);
  } else if (args.alias.length === 1) {
    const action = args.alias[0];
    if (action === "init") {
      await handleInit();
    }
  } else if (args.alias.length < 2) {
    throw new CommandError(
      "You must specify two arguments: alias and snippet."
    );
  } else {
    handleAdd(args.alias);
  }
}

module.exports = handleAlias;
