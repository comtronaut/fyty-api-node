import { Module } from "@nestjs/common";
import { PrismaService } from "src/services/prisma.service";
import { DebugController } from "./debug.controller";
import { DebugService } from "./debug.service";

@Module({
  imports: [],
  controllers: [ DebugController ],
  providers: [ DebugService, PrismaService ]
})
export class DebugModule {}
