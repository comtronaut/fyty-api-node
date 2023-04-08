import { Module } from "@nestjs/common";
import { PrismaService } from "src/services/prisma.service";
import { ChatController } from "./chat.controller";
import { ChatGateway } from "./chat.gateway";
import { ChatService } from "./chat.service";
import { MessageService } from "./messages/message.service";
import { NotifyService } from "../line_notify/lineNotify.service";

@Module({
  imports: [],
  controllers: [ ChatController ],
  providers: [ ChatService, MessageService, ChatGateway, PrismaService, NotifyService ]
})
export class ChatModule {}
