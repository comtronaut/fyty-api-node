import { Module } from "@nestjs/common";
import { NotifyService } from "../notification/lineNotify.service";
import { ChatController } from "./chat.controller";
import { ChatGateway } from "./chat.gateway";
import { ChatService } from "./chat.service";
import { MessageService } from "./message.service";

@Module({
  imports: [],
  controllers: [ ChatController ],
  providers: [ ChatService, MessageService, ChatGateway, NotifyService ]
})
export class ChatModule {}
