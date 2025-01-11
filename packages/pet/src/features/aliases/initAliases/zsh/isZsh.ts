export function isZsh() {
  return process.env.SHELL && process.env.SHELL.indexOf("zsh") > -1;
}
