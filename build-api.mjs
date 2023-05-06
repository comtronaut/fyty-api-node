import fs from "fs/promises";
import path from "path";

const genPath = "src";
const outPath = "export/modules";
const schemaPath = "src/model/schema/index.ts";

const render = (content) => [
  "import { makeApi } from \"@zodios/core\";",
  "import { z } from \"zod\";",
  "import * as schema from \"../schema\";",
  "",
  "export default makeApi([",
  content,
  "]);",
  ""
].join("\n");

const renderClient = (importList) => [
  "import { Zodios } from \"@zodios/core\";",
  "import { config } from \"core/config\";",
  importList.map((x) => x.at(0)).join("\n"),
  "",
  "export const coreApi = new Zodios(",
  "  config.coreApiOrigin,",
  "  [",
  importList.map((x) => `    ...${x.at(1)}`).join(",\n"),
  "  ],",
  "  {",
  "    axiosConfig: {",
  "      headers: {",
  "        \"Content-Type\": \"application/json\"",
  "      }",
  "    }",
  "  }",
  ");",
  ""
].join("\n");

async function findControllerFiles(thisPath, res = []) {
  const readFile = await fs.readdir(thisPath);

  for (const filename of readFile) {
    const currentPath = path.join(thisPath, filename);
    const fileStats = await fs.stat(currentPath);

    if (fileStats.isFile() && filename.includes(".controller.ts")) {
      res.push(currentPath);
    }
    if (fileStats.isDirectory()) {
      await findControllerFiles(currentPath, res);
    }
  }

  return res;
}

async function parseFile(filePath, exportContent) {
  const raw = await fs.readFile(filePath, "utf8");
  const name = parseFileName(filePath);
  const normalizedName = name.replace(/-/g, "");
  const newName = `${name}.ts`;

  exportContent.push([ `import ${normalizedName} from "./modules/${name}";`, normalizedName ]);

  await fs.writeFile(path.join(outPath, newName), render(""));
  // console.log(raw, name);
}

function parseFileName(filePath) {
  const lastPortion = filePath.split("/").at(-1);
  const name = lastPortion.split(".").at(0);
  return name;
}

async function main() {
  const controllerFilePaths = await findControllerFiles(genPath);

  // console.log(controllerFilePaths);

  const importList = [];
  for (const filePath of controllerFilePaths) {
    await parseFile(filePath, importList);
    // break;
  }

  await fs.cp(schemaPath, "export/schema.ts");
  await fs.writeFile("export/client.ts", renderClient(importList));
}
void main();
