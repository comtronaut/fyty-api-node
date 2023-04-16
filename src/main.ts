import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { json, urlencoded } from "express";
import { AppModule } from "./app.module";
import env from "./common/env.config";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: env.SERVER_ORIGIN === "https://api.fyty-esport.com"
      ? { origin: env.CLIENT_ORIGIN }
      : true
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true, forbidNonWhitelisted: true }));
  app.use(json({ limit: "50mb" }));
  app.use(urlencoded({ extended: true, limit: "50mb" }));

  // swagger api document
  const config = new DocumentBuilder()
    .setTitle("FyTy API")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("", app, document);

  // binding
  const port = process.env["PORT"] || 3000;
  await app.listen(port);

  Logger.log(`server listening: ${await app.getUrl()}`);
  Logger.log(env.POSTGRES_URL);
}
void bootstrap();
