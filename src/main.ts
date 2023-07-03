import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { patchNestJsSwagger } from "nestjs-zod";

import { AppModule } from "./app.module";
import env from "./common/env.config";

dayjs.extend(utc);

patchNestJsSwagger();

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors:
      env.SERVER_ORIGIN === "https://api.fyty-esport.com"
        ? {
          origin: [
            env.CLIENT_ORIGIN,
            "https://admin.fyty-esport.com",
            "https://fyty-esport.com"
          ]
        }
        : true,
    bodyParser: true
  });

  // binding
  const port = process.env["PORT"] || 3000;
  await app.listen(port);

  Logger.log(`server listening: ${await app.getUrl()}`);
  Logger.log(env.POSTGRES_URL);
}
void bootstrap();
