const fs = require("fs");
const path = require("path");
const handleInit = require("./init");

jest.mock("../../config", () => {
  const path = require("path");
  const mergeDeep = require("../../util/mergeDeep");

  const base = ".tmp";
  const dotPet = path.join(base, ".pet");
  let config = {
    path: {
      base,
      dotPet,
      aliases: {
        base: path.join(dotPet, "aliases"),
        config: path.join(dotPet, "aliases", "config.json"),
      },
    },
    platform: "win32",
  };
  return {
    config,
    updateConfig: (parameters) => (config = mergeDeep(config, parameters)),
  };
});

jest.mock("child_process", () => {
  const path = require("path");
  return {
    exec: (...args) => {
      const callback = args[args.length - 1];
      callback(
        null,
        {
          stdout: path.normalize(
            path.join(
              path.join(".tmp", "windows"),
              "Microsoft.PowerShell_profile.ps1"
            )
          ),
        },
        null
      );
    },
  };
});

afterAll(() => {
  return fs.rmSync(".tmp", {
    recursive: true,
    force: true,
  });
});

test("alias init (windows)", async () => {
  await handleInit();
  const aliasesConfigPath = path.normalize(
    path.join(".tmp", ".pet", "aliases", "config.json")
  );
  const aliasesConfig = JSON.parse(
    fs.readFileSync(aliasesConfigPath).toString()
  );
  expect(aliasesConfig).toEqual({ shells: ["powershell"] });
  const powershellProfilePath = path.normalize(
    path.join(".tmp", "windows", "Microsoft.PowerShell_profile.ps1")
  );
  const powershellProfile = fs.readFileSync(powershellProfilePath).toString();
  expect(powershellProfile.trim()).toEqual(
    `. ${path.join(
      ".tmp",
      ".pet",
      "aliases",
      "transformed",
      "PowerShell_aliases.ps1"
    )}`
  );
});
