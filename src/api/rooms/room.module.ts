import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Chat } from "src/model/sql-entity/chat.entity";
import { RoomParticipant } from "src/model/sql-entity/participant.entity";
import { Room } from "src/model/sql-entity/room.entity";
import { ChatModule } from "../chats/chat.module";
import { ChatService } from "../chats/chat.service";
import { RoomParticipantService } from "./participants/room-participant.service";
import { RoomController } from "./room.controller";
import { RoomService } from "./room.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([ Room, RoomParticipant, Chat ]),
    ChatModule
  ],
  controllers: [ RoomController ],
  providers: [ RoomService, RoomParticipantService, ChatService ]
})
export class RoomModule { }
