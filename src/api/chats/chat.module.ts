import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Chat } from "src/model/sql-entity/chat.entity";
import { Message } from "src/model/sql-entity/message.entity";
import { ChatController } from "./chat.controller";
import { ChatService } from "./chat.service";
import { MessageService } from "./messages/message.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([ Chat, Message ])
  ],
  controllers: [ ChatController ],
  providers: [ ChatService, MessageService ]
})
export class ChatModule { }
