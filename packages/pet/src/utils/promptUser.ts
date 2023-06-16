import readline from "readline";

async function promptUser(prompt: string, defaultValue = ""): Promise<string> {
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

export default promptUser;
