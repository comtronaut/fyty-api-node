import { Module } from "@nestjs/common";
import { PrismaService } from "src/services/prisma.service";
import { ImageController } from "./image.controller";
import { ImageService } from "./image.service";

@Module({
  imports: [ PrismaService ],
  controllers: [ ImageController ],
  providers: [ ImageService ]
})
export class ImageModule {}
