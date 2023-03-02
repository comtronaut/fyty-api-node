import { Module } from "@nestjs/common";
import { PrismaService } from "src/services/prisma.service";
import { SelectorController } from "./selector.controller";
import { SelectorService } from "./selector.service";

@Module({
  imports: [],
  controllers: [ SelectorController ],
  providers: [ SelectorService, PrismaService ]
})
export class SelectorModule {}
