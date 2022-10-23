import path from "path";
import fs from "fs";

export function createFileIfNotExists(filePath) {
  if (!fileExists(filePath)) {
    const dirPath = path.dirname(filePath);
    createDirectoryIfNotExists(dirPath);
    fs.openSync(filePath, "a");
  }
}

export function createDirectoryIfNotExists(dirPath) {
  if (!fileExists(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

export function deleteEmptyInFilePath(filePath) {
  if (isFileEmpty(filePath)) {
    fs.rmSync(filePath);
  }
  let dirPath = path.dirname(filePath);
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

export function fileExists(filePath) {
  return fs.existsSync(filePath);
}

export function isFileEmpty(filePath) {
  const stat = fs.statSync(filePath);
  return stat.size === 0;
}

export function isDirEmpty(dirPath) {
  const dirFiles = fs.readdirSync(dirPath);
  console.log(dirFiles);
  return dirFiles.length === 0;
}

export function readJsonFile(filePath) {
  return JSON.parse(fs.readFileSync(filePath));
}
