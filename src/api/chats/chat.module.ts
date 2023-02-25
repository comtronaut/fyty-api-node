import { Module } from "@nestjs/common";
import { PrismaService } from "src/services/prisma.service";
import { ChatController } from "./chat.controller";
import { ChatGateway } from "./chat.gateway";
import { ChatService } from "./chat.service";
import { MessageService } from "./messages/message.service";

@Module({
  imports: [ PrismaService ],
  controllers: [ ChatController ],
  providers: [ ChatService, MessageService, ChatGateway ]
})
export class ChatModule {}
