const fs = require("fs");
const path = require("path");
const os = require("os");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const clc = require("cli-color");
const { config, updateConfig } = require("../../config");
const PowerShell = require("../shells/PowerShell");

function handleInit() {
  if (config.platform === "win32") {
    const powerShell = new PowerShell();
    powerShell.init();
  } else {
    console.log("OS not supported.");
  }
}

module.exports = handleInit;

// function handleUnixInit(dotPetAliasesPath, rcFilePath) {
//   const bashRcTemplatePath = path.join(
//     path.dirname(require.main.filename),
//     "os",
//     "bashrc_template"
//   );
//   const bashRcTemplate = fs.readFileSync(bashRcTemplatePath, {
//     encoding: "utf-8",
//   });
//   const dotPetTemplate = bashRcTemplate.replace(
//     new RegExp("{{dotPetAliasesPath}}", "g"),
//     dotPetAliasesPath
//   );

//   fs.writeFileSync(rcFilePath, dotPetTemplate, { flag: "a+" });
// }
