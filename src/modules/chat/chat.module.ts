import { Module } from "@nestjs/common";

import { ChatController } from "./chat.controller";
import { ChatService } from "./chat.service";
import { MessageService } from "./message.service";
import { LineNotifyService } from "../notification/line-notify.service";

@Module({
  imports: [],
  controllers: [ ChatController ],
  providers: [ ChatService, MessageService, LineNotifyService ]
})
export class ChatModule {}
