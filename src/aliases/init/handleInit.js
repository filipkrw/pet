const fs = require("fs");
const path = require("path");
const os = require("os");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const clc = require("cli-color");
const { powershellInit } = require("./shellInit");

module.exports = function handleInit(dotPetAliasesPath, dotPetPath) {
  const platform = os.platform();

  powershellInit(dotPetPath);

  // if (platform === "linux") {
  //   const bashrcPath = path.join(os.homedir(), ".bashrc");
  //   handleUnixInit(dotPetAliasesPath, bashrcPath);
  // } else if (platform === "darwin") {
  //   const zshrcPath = path.join(os.homedir(), ".zshrc");
  //   handleUnixInit(dotPetAliasesPath, zshrcPath);
  // } else if (platform === "win32") {
  //   handleWindowsInit(dotPetPath);
  // } else {
  //   console.log("OS not supported.");
  // }
};

async function handleWindowsInit(dotPetPath) {
  const dotPetBatchPath = path.join(dotPetPath, "batch_files");
  const addEnvScriptPath = path.join(
    path.dirname(require.main.filename),
    "os",
    "Add-EnvPath.ps1"
  );
  const command = `powershell -command "& { . ${addEnvScriptPath}; Add-EnvPath '${dotPetBatchPath}' 'User' }"`;
  const { stdout, stderr } = await exec(command);
  process.stdout.write(stderr);
  process.stdout.write(stdout);
  if (!stderr) {
    console.log(
      clc.green("Init success. Restart the terminal for changes to take place.")
    );
  }
}

function handleUnixInit(dotPetAliasesPath, rcFilePath) {
  const bashRcTemplatePath = path.join(
    path.dirname(require.main.filename),
    "os",
    "bashrc_template"
  );
  const bashRcTemplate = fs.readFileSync(bashRcTemplatePath, {
    encoding: "utf-8",
  });
  const dotPetTemplate = bashRcTemplate.replace(
    new RegExp("{{dotPetAliasesPath}}", "g"),
    dotPetAliasesPath
  );

  fs.writeFileSync(rcFilePath, dotPetTemplate, { flag: "a+" });
}
