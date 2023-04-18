import { Module } from "@nestjs/common";
import { NotifyService } from "../notification/lineNotify.service";
import { ChatController } from "./chat.controller";
import { ChatService } from "./chat.service";
import { MessageService } from "./message.service";

@Module({
  imports: [],
  controllers: [ ChatController ],
  providers: [ ChatService, MessageService, NotifyService ]
})
export class ChatModule {}
