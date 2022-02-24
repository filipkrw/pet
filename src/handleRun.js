const util = require("util");
const exec = util.promisify(require("child_process").exec);

async function handleRun(args, basePath) {
  const command = args.run.join(" ");
  const { stdout, stderr } = await exec(command, { cwd: basePath });
  process.stdout.write(stderr);
  process.stdout.write(stdout);
}

module.exports = handleRun;
