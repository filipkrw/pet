function escapeRegex(string) {
    return string.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
}
export default escapeRegex;
