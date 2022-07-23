import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Chat } from "src/model/sql-entity/chat.entity";
import { Game } from "src/model/sql-entity/game.entity";
import { RoomParticipant } from "src/model/sql-entity/room/participant.entity";
import { Room } from "src/model/sql-entity/room/room.entity";
import { TeamMember } from "src/model/sql-entity/team/team-member.entity";
import { Team } from "src/model/sql-entity/team/team.entity";
import { ChatModule } from "../chats/chat.module";
import { ChatService } from "../chats/chat.service";
import { TeamService } from "../teams/team.service";
import { RoomParticipantService } from "./participants/room-participant.service";
import { RoomController } from "./room.controller";
import { RoomGateway } from "./room.gateway";
import { RoomService } from "./room.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([ Room, RoomParticipant, Chat, Team,TeamMember, Game ]),
    ChatModule
  ],
  controllers: [ RoomController ],
  providers: [ RoomService, RoomParticipantService, RoomGateway, ChatService, TeamService ]
})
export class RoomModule { }
