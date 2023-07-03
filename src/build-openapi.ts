import * as fs from "fs/promises";

import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { patchNestJsSwagger } from "nestjs-zod";
import YAML from "yaml";

import env from "common/env.config";

import { AppModule } from "./app.module";

dayjs.extend(utc);

patchNestJsSwagger();

const EXPORT_PATH = "export/api.yaml";
const SCHEMA_PATH = "src/model/schema/index.ts";
const EXPORT_SCHEMA_PATH = "export/schema.ts";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const config = new DocumentBuilder()
    .setTitle("FyTy API")
    .setVersion("1.0")
    .addBearerAuth()
    .addServer(env.SERVER_ORIGIN.replace("-dev", ""))
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (_, methodKey) => methodKey
  });

  await fs.writeFile(EXPORT_PATH, YAML.stringify(document));
  await fs.copyFile(SCHEMA_PATH, EXPORT_SCHEMA_PATH);
}
void bootstrap();
