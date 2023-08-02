import { Module } from "@nestjs/common";

import { CallbackController } from "./callback.controller";
import { LineNotifyController } from "./line-notify.controller";
import { NotifyService } from "./line-notify.service";

@Module({
  imports: [],
  controllers: [ LineNotifyController, CallbackController ],
  providers: [ NotifyService ]
})
export class NotifyModule {}
