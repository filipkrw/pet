module.exports = function getCwd() {
  return process.cwd().replace(/\\/g, "/");
};
