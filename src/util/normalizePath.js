/**
 * Standard `path.normalize` behavior differes between Windows and Unix.
 */
function normalizePath(path) {
    return path.replace(/\\/g, "/");
}
export default normalizePath;
