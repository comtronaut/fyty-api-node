import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { ExpressAdapter, NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import express, { json, urlencoded } from "express";
import fs from "fs";
import http from "http";
import { AppModule } from "./app.module";

async function bootstrap() {
  if (process.env["HOST"] === "0.0.0.0") {
    const expressApp = express();
    const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter(expressApp), {
      httpsOptions: {
        key: fs.readFileSync("cert/ssl.key"),
        cert: fs.readFileSync("cert/ssl.crt")
      },
      cors: true
    });

    extendApp(app);

    await app.init();

    if (process.env["PORT"] === "8080") {
      await app.listen(8080);
    }
    else {
      http.createServer(expressApp).listen(80);
      await app.listen(443);
    }
  }
  else {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: true });
    
    extendApp(app);

    // swagger api document
    const config = new DocumentBuilder()
      .setTitle("FyTy API")
      .setVersion("1.0")
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api", app, document);

    // binding
    const port = process.env["PORT"] || 3000;
    await app.listen(port);
    Logger.log(`server listening: ${await app.getUrl()}`);
  }
}
bootstrap();

function extendApp(app: NestExpressApplication) {
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(json({ limit: "50mb" }));
  app.use(urlencoded({ extended: true, limit: "50mb" }));

  return app;
}
