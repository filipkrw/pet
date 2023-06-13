/**
 * Standard `path.normalize` behavior differes between Windows and Unix.
 */
export function normalizePath(path: string) {
  return path.replace(/\\/g, "/");
}
