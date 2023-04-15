import { Module } from "@nestjs/common";
import { CallbackController } from "./callback.controller";
import { LineNotifyController } from "./lineNotify.controller";
import { NotifyService } from "./lineNotify.service";

@Module({
  imports: [],
  controllers: [ LineNotifyController, CallbackController ],
  providers: [ NotifyService ]
})
export class NotifyModule {}
