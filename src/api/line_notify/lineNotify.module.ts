import { Module } from "@nestjs/common";
import { PrismaService } from "src/services/prisma.service";
import { CallbackController } from "./callback.controller";
import { LineNotifyController } from "./lineNotify.controller";
import { NotifyService } from "./lineNotify.service";

@Module({
  imports: [],
  controllers: [ LineNotifyController, CallbackController ],
  providers: [ NotifyService, PrismaService ]
})
export class NotifyModule {}
