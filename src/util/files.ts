import path from "path";
import fs from "fs";

export function createFileIfNotExists(filePath: string) {
  if (!fileExists(filePath)) {
    const dirPath = path.dirname(filePath);
    createDirectoryIfNotExists(dirPath);
    fs.openSync(filePath, "a");
  }
}

export function createDirectoryIfNotExists(dirPath: string) {
  if (!fileExists(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

export function deleteEmptyInFilePath(filePath: string) {
  if (isFileEmpty(filePath)) {
    fs.rmSync(filePath);
  }
  const dirPath = path.dirname(filePath);
  deleteEmptyInDirPath(dirPath);
}

export function deleteEmptyInDirPath(dirPath: string) {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (isDirEmpty(dirPath)) {
      fs.rmdirSync(dirPath);
      dirPath = path.dirname(dirPath);
    } else {
      break;
    }
  }
}

export function fileExists(filePath: string) {
  return fs.existsSync(filePath);
}

export function isFileEmpty(filePath: string) {
  const stat = fs.statSync(filePath);
  return stat.size === 0;
}

export function isDirEmpty(dirPath: string) {
  const dirFiles = fs.readdirSync(dirPath);
  return dirFiles.length === 0;
}
