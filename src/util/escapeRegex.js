module.exports = function escapeRegex(string) {
  return string.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
};
