const fs = require("fs");

function handleHelp() {
  const help = fs.readFileSync(`${__dirname}/help.txt`, "utf8");
  console.log(help);
}

module.exports = handleHelp;
