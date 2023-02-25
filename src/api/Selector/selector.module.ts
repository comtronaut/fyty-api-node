import { Module } from "@nestjs/common";
import { PrismaService } from "src/services/prisma.service";
import { SelectorController } from "./selector.controller";
import { SelectorService } from "./selector.service";

@Module({
  imports: [ PrismaService ],
  controllers: [ SelectorController ],
  providers: [ SelectorService ]
})
export class SelectorModule {}
