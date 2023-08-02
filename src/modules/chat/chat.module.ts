import { Module } from "@nestjs/common";

import { NotificationService } from "modules/notification/notification.service";

import { ChatController } from "./chat.controller";
import { ChatService } from "./chat.service";
import { MessageService } from "./message.service";
import { LineNotifyService } from "../notification/line-notify.service";

@Module({
  imports: [],
  controllers: [ ChatController ],
  providers: [ ChatService, MessageService, LineNotifyService, NotificationService ]
})
export class ChatModule {}
