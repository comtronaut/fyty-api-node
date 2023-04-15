import { Module } from "@nestjs/common";
import { DebugController } from "./debug.controller";
import { DebugService } from "./debug.service";

@Module({
  imports: [],
  controllers: [ DebugController ],
  providers: [ DebugService ]
})
export class DebugModule {}
