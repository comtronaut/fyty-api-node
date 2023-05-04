import fs from "fs/promises";
import path from "path";

const genPath = "src";

async function findControllerFiles(path, res = []) {
  const readFile = await fs.readdir(path);

  for (const filename of readFile) {
    const currentPath = path.join(path, filename);
    const fileStats = await fs.stat(currentPath);

    if (fileStats.isFile() && filename.includes(".controller")) {
      res.push(currentPath);
    }
    if (fileStats.isDirectory()) {
      await findControllerFiles(currentPath, res);
    }
  }
}

async function main() {
  const controllerFilePaths = await findControllerFiles(genPath);

  console.log(controllerFilePaths);
}
void main();
