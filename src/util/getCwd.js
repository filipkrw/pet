function getCwd() {
  return process.cwd().replace(/\\/g, "/");
}

export default getCwd;
