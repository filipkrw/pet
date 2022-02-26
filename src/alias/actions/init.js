const fs = require("fs");
const path = require("path");
const os = require("os");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const clc = require("cli-color");
const initPowershell = require("../shells/powershell/init");
const { config, updateConfig } = require("../../config");

function handleInit() {
  if (config.platform === "win32") {
    initPowershell();
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
