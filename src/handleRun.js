const util = require("util");
const { config } = require("./config");
const exec = util.promisify(require("child_process").exec);

async function handleRun(args) {
  const command = args.run.join(" ");
  const { stdout, stderr } = await exec(command, { cwd: config.path.base });
  process.stdout.write(stderr);
  process.stdout.write(stdout);
}

module.exports = handleRun;
