import fs from "fs/promises";
import path from "path";

const genPath = "src/validators";

async function main() {
  const dir = await fs.readdir(genPath);

  for (const dirName of dir) {
    const innerPath = path.join(genPath, dirName);
    const fileStats = await fs.stat(innerPath);

    if (fileStats.isFile()) {
      await fs.rm(innerPath);
    }
    if (fileStats.isDirectory()) {
      const innerDir = await fs.readdir(innerPath);

      for (const innerName of innerDir) {
        const innerInnerPath = path.join(innerPath, innerName);

        if (dirName === "modelSchema") {
          if (innerInnerPath.includes("index")) {
            await fs.rm(innerInnerPath);
          }
        }
        if (dirName === "inputTypeSchemas") {
          if (innerInnerPath.includes("ScalarFieldEnum") || innerInnerPath.includes("index")) {
            await fs.rm(innerInnerPath);
          }
        }
      }
    }
  }
}
void main();
