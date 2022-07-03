import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Chat } from "src/model/sql-entity/chat.entity";
import { Message } from "src/model/sql-entity/message.entity";
import { ChatController } from "./chat.controller";
import { ChatGateway } from "./chat.gateway";
import { ChatService } from "./chat.service";
import { MessageService } from "./messages/message.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([ Chat, Message ])
  ],
  controllers: [ ChatController ],
  providers: [ ChatService, MessageService, ChatGateway ]
})
export class ChatModule { }
