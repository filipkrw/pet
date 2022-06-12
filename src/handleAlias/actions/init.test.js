const fs = require("fs");
const path = require("path");
const mockConfig = require("../../util/mockConfig");
const handleInit = require("./init");
const { updateConfig } = require("../../config");

afterEach(() => {
  return fs.rmSync(".tmp", {
    recursive: true,
    force: true,
  });
});

const aliasesConfigPath = path.normalize(
  path.join(".tmp", ".pet", "aliases", "config.json")
);

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

test("alias init (windows)", async () => {
  const base = ".tmp";
  const dotPet = path.join(base, ".pet");
  updateConfig({
    path: {
      base,
      dotPet,
      aliases: {
        base: path.join(dotPet, "aliases"),
        config: path.join(dotPet, "aliases", "config.json"),
      },
    },
    platform: "win32",
  });

  await handleInit();
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

// test("alias init (bash)", async () => {
//   os.homedir.mockImplementation(() => path.join(".tmp", "bash"));
//   await handleInit();
//   const aliasesConfig = JSON.parse(
//     fs.readFileSync(aliasesConfigPath).toString()
//   );
//   expect(aliasesConfig).toEqual({ shells: ["bash"] });
//   const bashrcPath = path.normalize(path.join(".tmp", "bash", ".bashrc"));
//   const bashrc = fs.readFileSync(bashrcPath).toString();

//   const aliasesPath = path.join(
//     ".tmp",
//     ".pet",
//     "aliases",
//     "transformed",
//     "bash_aliases"
//   );
//   expect(bashrc.trim()).toEqual(
//     `
// # PET ALIASES START
// if [ -f "${aliasesPath}" ]; then
//     . "${aliasesPath}"
// fi
// # PET ALIASES END
//     `.trim()
//   );
// });
