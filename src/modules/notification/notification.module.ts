import { Module } from "@nestjs/common";

import { LineNotifyCallbackController } from "./line-notify-callback.controller";
import { LineNotifyController } from "./line-notify.controller";
import { LineNotifyService } from "./line-notify.service";
import { NotificationController } from "./notification.controller";
import { NotificationService } from "./notification.service";

@Module({
  imports: [],
  controllers: [ LineNotifyController, LineNotifyCallbackController, NotificationController ],
  providers: [ LineNotifyService, NotificationService ]
})
export class NotifyModule {}
