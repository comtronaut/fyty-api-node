import * as fs from "fs/promises";

import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { patchNestJsSwagger } from "nestjs-zod";
import YAML from "yaml";

import { AppModule } from "./app.module";

dayjs.extend(utc);

patchNestJsSwagger();

const EXPORT_PATH = "openapi.yaml";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const config = new DocumentBuilder()
    .setTitle("FyTy API")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (_, methodKey) => methodKey
  });

  await fs.writeFile(EXPORT_PATH, YAML.stringify(document));
}
void bootstrap();
