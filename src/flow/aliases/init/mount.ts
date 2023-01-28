import { UserPlatformData } from "./getUserPlatformData.js";
import { mountZsh } from "./zsh/mountZsh.js";

export async function mount({
  platformData,
}: {
  platformData: UserPlatformData;
}) {
  const { platform, shell } = platformData;

  if (["linux", "darwin"].includes(platform)) {
    if (shell.indexOf("zsh") > -1) {
      mountZsh();
    }
  }

  // if (platform === "win32") {
  //   const powerShell = new PowerShell();
  //   await powerShell.init();
  // } else if (["linux", "darwin"].includes(platform)) {
  //   if (shell.indexOf("bash") > -1) {
  //     const bash = new Bash();
  //     bash.init();
  //   } else if (shell.indexOf("zsh") > -1) {
  //     const zsh = new Zsh();
  //     zsh.init();
  //   } else {
  //     throw new CommandError(`Shell "${shell}" not supported.`);
  //   }
  // } else {
  //   throw new CommandError(`Platform "${platform}" not supported.`);
  // }
}
