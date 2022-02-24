const fs = require("fs");
const path = require("path");
const os = require("os");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const clc = require("cli-color");

function handleAlias(args, basePath) {
  const dotPetPath = path.join(basePath, ".pet");
  const dotPetAliasesPath = path.join(dotPetPath, ".pet_aliases");
  const dotPetBatchPath = path.join(dotPetPath, "batch_files");

  if (args.alias.length > 0 && args.alias[0] === "init") {
    handleInit(dotPetAliasesPath, dotPetPath);
    return;
  }

  if (args.alias.length < 2) {
    throw new Error("You must specify two arguments: alias and snippet");
  }

  const [alias, snippetPath] = args.alias;

  if (!fs.existsSync(dotPetBatchPath)) {
    fs.mkdirSync(dotPetBatchPath, { recursive: true });
  }

  const snippet = getSnippet(path.join(basePath, snippetPath));
  const aliasEntry = `alias ${alias}="${parseSnippetToCommand(
    snippet,
    "$"
  )}"\n`;
  fs.writeFileSync(dotPetAliasesPath, aliasEntry, { flag: "a+" }, (error) => {
    if (error) throw new Error(error);
  });

  const aliasBatFilePath = path.join(dotPetBatchPath, `${alias}.bat`);
  fs.writeFileSync(
    aliasBatFilePath,
    parseSnippetToCommand(snippet, "%"),
    { flag: "wx" },
    (error) => {
      if (error) throw new Error(error);
    }
  );
}

function parseSnippetToCommand(snippet, varSignifier) {
  let i = 0;
  return snippet.replace(/(<[^>]*>)/g, () => {
    i++;
    return `${varSignifier}${i}`;
  });
}

function handleInit(dotPetAliasesPath, dotPetPath) {
  const platform = os.platform();

  if (platform === "linux") {
    const bashrcPath = path.join(os.homedir(), ".bashrc");
    handleUnixInit(dotPetAliasesPath, bashrcPath);
  } else if (platform === "darwin") {
    const zshrcPath = path.join(os.homedir(), ".zshrc");
    handleUnixInit(dotPetAliasesPath, zshrcPath);
  } else if (platform === "win32") {
    handleWindowsInit(dotPetPath);
  } else {
    console.log("OS not supported.");
  }
}

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

function getSnippet(fullPath) {
  const snippet = fs.readFileSync(fullPath).toString().split("\n")[0];
  return snippet;
}

module.exports = handleAlias;
