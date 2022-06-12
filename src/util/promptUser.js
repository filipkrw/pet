const readline = require("readline");

async function promptUser(prompt, defaultValue = "") {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt,
  });

  return new Promise((resolve) => {
    rl.prompt();
    rl.write(defaultValue);
    rl.on("line", (input) => {
      rl.close();
      resolve(input);
    });
  });
}

module.exports = promptUser;
