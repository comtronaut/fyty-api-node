import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import env from "./common/env.config";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: env.SERVER_ORIGIN === "https://api.fyty-esport.com" ? { origin: env.CLIENT_ORIGIN } : true,
    bodyParser: true
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true, forbidNonWhitelisted: true }));

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
